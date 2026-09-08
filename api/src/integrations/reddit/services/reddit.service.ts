import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { PostSortOrder, SourceType, TopTimeRange } from 'generated/prisma';
import { RedditConfig } from '../config/reddit.config';
import { RedditOAuthService } from './reddit-oauth.service';
import { BrightDataConfig } from '../config/bright-data.config';
import { BrightDataRedditService } from './bright-data-reddit.service';
import { parseRedditUrl } from '../utils/reddit-url.utils';
import {
  FetchPostWithCommentsOptions,
  FetchSubredditPostsOptions,
  RawRedditComment,
  RawRedditPost,
  RedditDetectSourceResult,
  RedditUrlInfo,
} from '../interfaces/reddit.interfaces';

const SORT_MAP: Record<PostSortOrder, string> = {
  [PostSortOrder.HOT]: 'hot',
  [PostSortOrder.TOP]: 'top',
  [PostSortOrder.NEW]: 'new',
  [PostSortOrder.RISING]: 'rising',
  [PostSortOrder.CONTROVERSIAL]: 'controversial',
};

const TIME_RANGE_MAP: Record<TopTimeRange, string> = {
  [TopTimeRange.HOUR]: 'hour',
  [TopTimeRange.DAY]: 'day',
  [TopTimeRange.WEEK]: 'week',
  [TopTimeRange.MONTH]: 'month',
  [TopTimeRange.YEAR]: 'year',
  [TopTimeRange.ALL]: 'all',
};

const MAX_LISTING_PAGES = 20;
const LISTING_PAGE_SIZE = 100;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;
const UNAUTHENTICATED_HOST = 'https://www.reddit.com';
const OAUTH_HOST = 'https://oauth.reddit.com';

@Injectable()
export class RedditService {
  private readonly logger = new Logger(RedditService.name);

  constructor(
    private readonly redditConfig: RedditConfig,
    private readonly redditOAuth: RedditOAuthService,
    private readonly brightDataConfig: BrightDataConfig,
    private readonly brightDataReddit: BrightDataRedditService,
  ) {}

  /**
   * Resolves the host + auth header to use for a request. When OAuth
   * credentials are configured, every request goes through oauth.reddit.com
   * with a bearer token (far higher, stable rate limits); otherwise falls
   * back to the public, unauthenticated www.reddit.com endpoints.
   */
  private async resolveRequestContext(): Promise<{
    host: string;
    headers: Record<string, string>;
  }> {
    const userAgent = this.redditConfig.getUserAgent();

    if (!this.redditConfig.hasOAuthCredentials()) {
      return {
        host: UNAUTHENTICATED_HOST,
        headers: { 'User-Agent': userAgent },
      };
    }

    const accessToken = await this.redditOAuth.getAccessToken();
    return {
      host: OAUTH_HOST,
      headers: {
        'User-Agent': userAgent,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  parseUrl(url: string): RedditUrlInfo {
    return parseRedditUrl(url);
  }

  /**
   * Interactive metadata preview for the "detect source" step, before a
   * ResearchProject is created. Deliberately does not use the retrying
   * `request()` helper below: a single failed attempt here should surface a
   * fast, classified result (public/private/not-found) to the user instead of
   * retrying with backoff, which `request()` does for the resilient
   * background ingestion pipeline.
   */
  async detectSource(url: string): Promise<RedditDetectSourceResult> {
    if (this.brightDataConfig.hasCredentials()) {
      return this.brightDataReddit.detectSource(url);
    }

    const urlInfo = parseRedditUrl(url);

    if (urlInfo.sourceType === SourceType.THREAD) {
      const result = await this.detectRequest<any[]>(
        `/r/${encodeURIComponent(urlInfo.community)}/comments/${encodeURIComponent(urlInfo.externalPostId ?? '')}.json`,
      );

      if (result.errorMessage || !result.data) {
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: false,
          error:
            result.errorMessage ??
            'Reddit did not return any data for this post.',
        };
      }

      const postData = result.data?.[0]?.data?.children?.[0]?.data;
      if (!postData) {
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: false,
          error:
            'This post could not be found. It may have been deleted, or the link is out of date.',
        };
      }

      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: true,
        title: postData.title || undefined,
        bodyPreview: this.previewText(postData.selftext),
        author: postData.author === '[deleted]' ? undefined : postData.author,
        score: typeof postData.score === 'number' ? postData.score : undefined,
        postCount: 1,
        commentCount:
          typeof postData.num_comments === 'number'
            ? postData.num_comments
            : undefined,
        postedAt: postData.created_utc
          ? new Date(postData.created_utc * 1000)
          : undefined,
        flairs: postData.link_flair_text ? [postData.link_flair_text] : [],
      };
    }

    const about = await this.detectRequest<any>(
      `/r/${encodeURIComponent(urlInfo.community)}/about.json`,
    );

    if (
      about.errorMessage ||
      !about.data ||
      about.data.data?.subreddit_type === 'private'
    ) {
      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: false,
        error:
          about.errorMessage ?? 'This subreddit is private or quarantined.',
      };
    }

    const aboutData = about.data.data;
    const hot = await this.detectRequest<any>(
      `/r/${encodeURIComponent(urlInfo.community)}/hot.json`,
      { limit: 10 },
    );

    const posts = hot.data
      ? (hot.data?.data?.children ?? [])
          .filter((child: any) => child.kind === 't3')
          .map((child: any) => child.data)
      : [];
    const flairs = Array.from(
      new Set(
        posts
          .map((post: any) => post.link_flair_text)
          .filter((flair: unknown): flair is string => !!flair),
      ),
    ).slice(0, 6) as string[];

    return {
      sourceType: urlInfo.sourceType,
      community: urlInfo.community,
      isPublic: true,
      title: aboutData.title || undefined,
      bodyPreview: this.previewText(aboutData.public_description),
      flairs,
    };
  }

  async fetchSubredditPosts(
    community: string,
    options: FetchSubredditPostsOptions,
  ): Promise<RawRedditPost[]> {
    if (this.brightDataConfig.hasCredentials()) {
      return this.brightDataReddit.fetchSubredditPosts(community, options);
    }

    const sort = SORT_MAP[options.sort] || 'hot';
    const params: Record<string, string | number> = {
      limit: LISTING_PAGE_SIZE,
    };

    if (sort === 'top' || sort === 'controversial') {
      params.t = options.topTimeRange
        ? TIME_RANGE_MAP[options.topTimeRange]
        : 'all';
    }

    const posts: RawRedditPost[] = [];
    let after: string | null = null;
    let page = 0;

    while (posts.length < options.limit && page < MAX_LISTING_PAGES) {
      const response = await this.request<any>(
        `/r/${encodeURIComponent(community)}/${sort}.json`,
        { ...params, ...(after ? { after } : {}) },
      );

      const children = response?.data?.children ?? [];
      if (children.length === 0) break;

      for (const child of children) {
        if (child.kind !== 't3') continue;
        const data = child.data;

        if (data.over_18 && !options.includeNsfw) continue;
        if (
          typeof options.minScore === 'number' &&
          (data.score ?? 0) < options.minScore
        )
          continue;

        posts.push(this.mapPost(data, community));
        if (posts.length >= options.limit) break;
      }

      after = response?.data?.after ?? null;
      page += 1;
      if (!after) break;
    }

    return posts;
  }

  async fetchPostWithComments(
    community: string,
    postId: string,
    options: FetchPostWithCommentsOptions,
  ): Promise<{ post: RawRedditPost; comments: RawRedditComment[] }> {
    if (this.brightDataConfig.hasCredentials()) {
      return this.brightDataReddit.fetchPostWithComments(
        community,
        postId,
        options,
      );
    }

    const params: Record<string, string | number> = {};
    if (options.maxComments) params.limit = options.maxComments;
    if (options.maxDepth) params.depth = options.maxDepth;

    const response = await this.request<any[]>(
      `/r/${encodeURIComponent(community)}/comments/${encodeURIComponent(postId)}.json`,
      params,
    );

    const [postListing, commentsListing] = response;
    const postData = postListing?.data?.children?.[0]?.data;
    if (!postData) {
      throw new BadGatewayException('Reddit post not found or unavailable');
    }

    const post = this.mapPost(postData, community);

    const comments: RawRedditComment[] = [];
    const topLevelChildren = commentsListing?.data?.children ?? [];
    this.flattenComments(topLevelChildren, null, 0, comments, options);

    return { post, comments };
  }

  private flattenComments(
    children: any[],
    parentExternalId: string | null,
    depth: number,
    acc: RawRedditComment[],
    options: FetchPostWithCommentsOptions,
  ): void {
    if (typeof options.maxDepth === 'number' && depth > options.maxDepth)
      return;

    for (const child of children) {
      if (options.maxComments && acc.length >= options.maxComments) return;
      if (child.kind === 'more') continue; // MVP limitation: "load more" threads are not expanded
      if (child.kind !== 't1') continue;

      const data = child.data;
      const score = data.score ?? 0;
      if (
        typeof options.minCommentScore === 'number' &&
        score < options.minCommentScore
      ) {
        continue;
      }

      const externalId = data.id;
      acc.push({
        external_id: externalId,
        parent_external_id: parentExternalId,
        author: data.author === '[deleted]' ? null : (data.author ?? null),
        body: this.normalizeCommentBody(data.body),
        score,
        depth,
        permalink: `https://www.reddit.com${data.permalink}`,
        is_deleted: data.author === '[deleted]' || data.body === '[deleted]',
        is_removed: data.body === '[removed]',
        posted_at: new Date((data.created_utc ?? 0) * 1000),
      });

      const replyChildren = data.replies?.data?.children;
      if (Array.isArray(replyChildren) && replyChildren.length > 0) {
        this.flattenComments(
          replyChildren,
          externalId,
          depth + 1,
          acc,
          options,
        );
      }
    }
  }

  private previewText(text: string | undefined | null): string | undefined {
    if (!text || text === '[deleted]' || text === '[removed]') return undefined;
    return text.length > 280 ? `${text.slice(0, 280)}…` : text;
  }

  private async detectRequest<T>(
    path: string,
    params: Record<string, string | number> = {},
  ): Promise<{ data: T | null; errorMessage: string | null }> {
    const usingOAuth = this.redditConfig.hasOAuthCredentials();

    try {
      const { host, headers } = await this.resolveRequestContext();
      const response = await axios.get<T>(`${host}${path}`, {
        params: { ...params, raw_json: 1 },
        headers,
        timeout: 8000,
      });
      return { data: response.data, errorMessage: null };
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;

      // A 401 against oauth.reddit.com means our token expired/was revoked,
      // not that the content is private — retry once with a fresh token.
      if (status === 401 && usingOAuth) {
        this.redditOAuth.invalidateToken();
        try {
          const { host, headers } = await this.resolveRequestContext();
          const response = await axios.get<T>(`${host}${path}`, {
            params: { ...params, raw_json: 1 },
            headers,
            timeout: 8000,
          });
          return { data: response.data, errorMessage: null };
        } catch (retryError) {
          return this.classifyDetectError(retryError as AxiosError);
        }
      }

      return this.classifyDetectError(axiosError);
    }
  }

  private classifyDetectError(axiosError: AxiosError): {
    data: null;
    errorMessage: string;
  } {
    const status = axiosError.response?.status;

    if (status === 403 || status === 401) {
      return {
        data: null,
        errorMessage: 'This subreddit is private or quarantined.',
      };
    }
    if (status === 404) {
      return {
        data: null,
        errorMessage:
          'This subreddit or post could not be found. It may have been banned, deleted, or the link is out of date.',
      };
    }

    this.logger.warn(
      `Reddit detect-source request failed: ${axiosError.message}`,
    );
    return {
      data: null,
      errorMessage:
        'Reddit could not be reached right now. Please try again in a moment.',
    };
  }

  private normalizeCommentBody(body: string | undefined): string | null {
    if (body === undefined || body === null) return null;
    if (body === '[deleted]' || body === '[removed]') return null;
    return body;
  }

  private mapPost(data: any, community: string): RawRedditPost {
    return {
      external_id: data.id,
      community,
      title: data.title ?? '',
      author: data.author === '[deleted]' ? null : (data.author ?? null),
      body:
        data.selftext === '[deleted]' ||
        data.selftext === '[removed]' ||
        !data.selftext
          ? null
          : data.selftext,
      url: data.url ?? `https://www.reddit.com${data.permalink}`,
      permalink: `https://www.reddit.com${data.permalink}`,
      score: data.score ?? 0,
      upvote_ratio:
        typeof data.upvote_ratio === 'number' ? data.upvote_ratio : null,
      num_comments: data.num_comments ?? 0,
      flair: data.link_flair_text ?? null,
      is_nsfw: !!data.over_18,
      is_deleted: data.author === '[deleted]',
      is_removed: !!data.removed_by_category || data.selftext === '[removed]',
      posted_at: new Date((data.created_utc ?? 0) * 1000),
    };
  }

  private async request<T>(
    path: string,
    params: Record<string, string | number>,
  ): Promise<T> {
    const usingOAuth = this.redditConfig.hasOAuthCredentials();
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { host, headers } = await this.resolveRequestContext();
        const response = await axios.get<T>(`${host}${path}`, {
          params: { ...params, raw_json: 1 },
          headers,
          timeout: 15000,
        });

        return response.data;
      } catch (error) {
        lastError = error;
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;

        // A 401 from oauth.reddit.com means the cached token expired/was
        // revoked, not that the content is unavailable — always worth one
        // retry with a freshly-fetched token, regardless of attempt count.
        if (status === 401 && usingOAuth) {
          this.redditOAuth.invalidateToken();
        }

        const isRetryable =
          (status === 401 && usingOAuth) ||
          !status ||
          status >= 500 ||
          status === 429 ||
          axiosError.code === 'ECONNABORTED';

        if (!isRetryable || attempt === MAX_RETRIES) {
          break;
        }

        const retryAfterHeader = axiosError.response?.headers?.['retry-after'];
        const retryAfterMs = retryAfterHeader
          ? Number(retryAfterHeader) * 1000
          : RETRY_BASE_DELAY_MS * 2 ** attempt;

        this.logger.warn(
          `Reddit request failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${retryAfterMs}ms: ${axiosError.message}`,
        );

        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : 'Unknown error';
    this.logger.error(`Failed to fetch data from Reddit: ${message}`);
    throw new BadGatewayException(
      `Failed to fetch data from Reddit: ${message}`,
    );
  }
}
