import { Injectable, Logger } from '@nestjs/common';
import { SourceType } from 'generated/prisma';
import { ApifyClientService } from './apify-client.service';
import { buildSubredditListingUrl, parseRedditUrl } from '../utils/reddit-url.utils';
import { nullIfDeleted, previewText, toNullableNumber, toNumber } from '../utils/reddit-mapping.utils';
import {
  ApifyRedditActorInput,
  ApifyRedditItem,
} from '../interfaces/apify-reddit.interfaces';
import {
  FetchPostWithCommentsOptions,
  FetchSubredditPostsOptions,
  RawRedditComment,
  RawRedditPost,
  RedditDetectSourceResult,
} from '../interfaces/reddit.interfaces';

/**
 * Reads Reddit data through the Apify `harshmaur~reddit-scraper` actor
 * (see `api/docs/reddit-scraper.yaml` for its input schema and
 * `api/docs/reddit-scraper-output.json` for its dataset item schema).
 * `RedditService` delegates here first when an `APIFY_API_TOKEN` is
 * configured, ahead of Bright Data and Reddit's own API.
 *
 * Beyond the `fetchSubredditPosts`/`fetchPostWithComments`/`detectSource`
 * contract shared with `BrightDataRedditService`, `run`/`runAsync` expose the
 * actor's full input schema (keyword search, full subreddit scrape, date
 * filters, MCP delivery, …) for callers that need more than that contract.
 */
@Injectable()
export class ApifyRedditService {
  private readonly logger = new Logger(ApifyRedditService.name);

  constructor(private readonly client: ApifyClientService) {}

  /** Runs the actor with a fully custom input and waits for completion. Meant for small/interactive jobs. */
  async run(input: ApifyRedditActorInput): Promise<ApifyRedditItem[]> {
    return this.client.runSyncGetDatasetItems(input);
  }

  /** Runs the actor asynchronously and waits for the full dataset. Meant for larger jobs (full subreddits, keyword search, …). */
  async runAsync(
    input: ApifyRedditActorInput,
    maxWaitMs?: number,
  ): Promise<ApifyRedditItem[]> {
    return this.client.runAndWaitForItems(input, maxWaitMs);
  }

  async fetchSubredditPosts(
    community: string,
    options: FetchSubredditPostsOptions,
  ): Promise<RawRedditPost[]> {
    const listingUrl = buildSubredditListingUrl(
      community,
      options.sort,
      options.topTimeRange,
    );

    // Over-fetch when a minScore filter is set, since the actor has no
    // server-side score threshold and filtering happens after the fact.
    const maxPostsCount =
      typeof options.minScore === 'number'
        ? Math.min(options.limit * 3, 50000)
        : options.limit;

    // Async trigger+poll, not run-sync: a full subreddit scrape can take
    // well beyond Apify's server-side sync window. This runs inside an
    // already-async background ingestion job (see `RedditIngestionService`),
    // so nobody is waiting on it live.
    const items = await this.client.runAndWaitForItems({
      startUrls: [{ url: listingUrl }],
      maxPostsCount,
      includeNSFW: !!options.includeNsfw,
    });

    return items
      .filter((item) => item.dataType === 'post')
      .map((item) => this.mapPost(item, community))
      .filter(
        (post) =>
          typeof options.minScore !== 'number' || post.score >= options.minScore,
      )
      .slice(0, options.limit);
  }

  async fetchPostWithComments(
    community: string,
    postId: string,
    options: FetchPostWithCommentsOptions,
  ): Promise<{ post: RawRedditPost; comments: RawRedditComment[] }> {
    const postUrl = `https://www.reddit.com/r/${encodeURIComponent(community)}/comments/${encodeURIComponent(postId)}/`;

    // Async trigger+poll: a heavily-commented post can take minutes to fully
    // crawl, well beyond run-sync's server-side window (same reasoning as
    // `fetchSubredditPosts` above).
    const items = await this.client.runAndWaitForItems({
      startUrls: [{ url: postUrl }],
      crawlCommentsPerPost: true,
      maxCommentsPerPost: options.maxComments ?? 200,
      includeNSFW: true,
    });

    const postItem = items.find((item) => item.dataType === 'post');
    if (!postItem) {
      throw new Error('Apify returned no data for this post.');
    }

    const post = this.mapPost(postItem, community);
    const comments = this.mapComments(
      items.filter((item) => item.dataType === 'comment'),
      options,
    );

    return { post, comments };
  }

  async detectSource(url: string): Promise<RedditDetectSourceResult> {
    const urlInfo = parseRedditUrl(url);

    try {
      if (urlInfo.sourceType === SourceType.THREAD) {
        const items = await this.client.runSyncGetDatasetItems({
          startUrls: [
            {
              url: `https://www.reddit.com/r/${urlInfo.community}/comments/${urlInfo.externalPostId}/`,
            },
          ],
          includeNSFW: true,
        });

        const postItem = items.find((item) => item.dataType === 'post');
        if (!postItem) {
          return {
            sourceType: urlInfo.sourceType,
            community: urlInfo.community,
            isPublic: false,
            error:
              'This post could not be found. It may have been deleted, or the link is out of date.',
          };
        }

        const post = this.mapPost(postItem, urlInfo.community);
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: true,
          title: post.title || undefined,
          bodyPreview: previewText(post.body),
          author: post.author ?? undefined,
          score: post.score,
          postCount: 1,
          commentCount: post.num_comments,
          postedAt: post.posted_at,
          flairs: post.flair ? [post.flair] : [],
        };
      }

      const items = await this.client.runSyncGetDatasetItems({
        startUrls: [{ url: `https://www.reddit.com/r/${urlInfo.community}/` }],
        includeNSFW: true,
        maxPostsCount: 10,
      });

      const postItems = items.filter((item) => item.dataType === 'post');
      if (!postItems.length) {
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: false,
          error:
            'This subreddit could not be reached. It may be private, banned, or does not exist.',
        };
      }

      const posts = postItems.map((item) => this.mapPost(item, urlInfo.community));
      const flairs = Array.from(
        new Set(posts.map((p) => p.flair).filter((f): f is string => !!f)),
      ).slice(0, 6);

      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: true,
        title: `r/${urlInfo.community}`,
        bodyPreview: previewText(posts[0]?.title),
        flairs,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Apify detect-source failed: ${message}`);
      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: false,
        error:
          'Reddit data could not be reached right now. Please try again in a moment.',
      };
    }
  }

  private mapPost(item: ApifyRedditItem, fallbackCommunity: string): RawRedditPost {
    const permalink = item.postUrl ?? item.url ?? '';
    const removedByCategory = item.removedByCategory ?? null;

    return {
      external_id: String(item.parsedId ?? item.id ?? ''),
      community: item.parsedCommunityName ?? fallbackCommunity,
      title: item.title ?? '',
      author: nullIfDeleted(item.authorName),
      body: nullIfDeleted(item.body),
      url: item.contentUrl ?? permalink,
      permalink,
      score: toNumber(item.score ?? item.upVotes),
      upvote_ratio: toNullableNumber(item.upvoteRatio),
      num_comments: toNumber(item.commentsCount),
      flair: item.flair ?? null,
      is_nsfw: !!item.over18,
      is_deleted: !item.authorName,
      is_removed: !!removedByCategory && removedByCategory !== 'deleted',
      posted_at: item.createdAt ? new Date(item.createdAt) : new Date(0),
    };
  }

  private mapComments(
    items: ApifyRedditItem[],
    options: FetchPostWithCommentsOptions,
  ): RawRedditComment[] {
    const comments: RawRedditComment[] = [];

    for (const item of items) {
      if (options.maxComments && comments.length >= options.maxComments) break;

      const score = toNumber(item.commentUpVotes ?? item.score);
      if (
        typeof options.minCommentScore === 'number' &&
        score < options.minCommentScore
      )
        continue;

      const depth = typeof item.depth === 'number' ? item.depth : 0;
      if (typeof options.maxDepth === 'number' && depth > options.maxDepth)
        continue;

      const removedByCategory = item.removedByCategory ?? null;

      comments.push({
        external_id: String(item.id ?? ''),
        parent_external_id:
          item.parentKind === 'comment' && item.parsedParentId
            ? String(item.parsedParentId)
            : null,
        author: nullIfDeleted(item.authorName),
        body: nullIfDeleted(item.body),
        score,
        depth,
        permalink: item.url ?? '',
        is_deleted: !item.authorName || item.body === '[deleted]',
        is_removed:
          item.body === '[removed]' ||
          (!!removedByCategory && removedByCategory !== 'deleted'),
        posted_at: item.commentCreatedAt
          ? new Date(item.commentCreatedAt)
          : new Date(0),
      });
    }

    return comments;
  }
}
