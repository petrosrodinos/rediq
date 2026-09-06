import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { PostSortOrder, TopTimeRange } from 'generated/prisma';
import { RedditConfig } from '../config/reddit.config';
import { parseRedditUrl } from '../utils/reddit-url.utils';
import {
  FetchPostWithCommentsOptions,
  FetchSubredditPostsOptions,
  RawRedditComment,
  RawRedditPost,
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

@Injectable()
export class RedditService {
  private readonly logger = new Logger(RedditService.name);

  constructor(private readonly redditConfig: RedditConfig) {}

  parseUrl(url: string): RedditUrlInfo {
    return parseRedditUrl(url);
  }

  async fetchSubredditPosts(
    community: string,
    options: FetchSubredditPostsOptions,
  ): Promise<RawRedditPost[]> {
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
        `https://www.reddit.com/r/${encodeURIComponent(community)}/${sort}.json`,
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
    const params: Record<string, string | number> = {};
    if (options.maxComments) params.limit = options.maxComments;
    if (options.maxDepth) params.depth = options.maxDepth;

    const response = await this.request<any[]>(
      `https://www.reddit.com/r/${encodeURIComponent(community)}/comments/${encodeURIComponent(postId)}.json`,
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
    url: string,
    params: Record<string, string | number>,
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get<T>(url, {
          params,
          headers: {
            'User-Agent': this.redditConfig.getUserAgent(),
          },
          timeout: 15000,
        });

        return response.data;
      } catch (error) {
        lastError = error;
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        const isRetryable =
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
