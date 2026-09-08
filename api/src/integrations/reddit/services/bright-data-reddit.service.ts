import { Injectable, Logger } from '@nestjs/common';
import { SourceType } from 'generated/prisma';
import {
  BRIGHT_DATA_COMMENTS_DATASET_ID,
  BRIGHT_DATA_POSTS_DATASET_ID,
} from '../config/bright-data.config';
import { BrightDataClientService } from './bright-data-client.service';
import { parseRedditUrl } from '../utils/reddit-url.utils';
import {
  FetchPostWithCommentsOptions,
  FetchSubredditPostsOptions,
  RawRedditComment,
  RawRedditPost,
  RedditDetectSourceResult,
} from '../interfaces/reddit.interfaces';

/**
 * Reads Reddit data through Bright Data's Web Scraper API instead of
 * Reddit's own API. Reddit closed self-serve OAuth app creation in Nov 2025
 * and blocked the unauthenticated `.json` fallback in May 2026, so this is
 * the reliable path when a `BRIGHT_DATA_API_TOKEN` is configured (see
 * `RedditService`, which delegates here first when credentials exist).
 *
 * Field mappings verified against a live post fetched through Bright Data
 * (see `fetchSubredditPosts` for the one confirmed limitation: the "Posts"
 * dataset has no subreddit-listing/sort mode, only single-URL lookup).
 * Comment field names are confirmed from Bright Data's own
 * `/datasets/gd_lvzdpsdlw09j6t702/metadata` schema; still read defensively
 * (multiple candidate keys) as a hedge against future field renames.
 */
@Injectable()
export class BrightDataRedditService {
  private readonly logger = new Logger(BrightDataRedditService.name);

  constructor(private readonly client: BrightDataClientService) {}

  /**
   * Verified against Bright Data's live `/datasets/gd_lvz8ah06191smkebj4/metadata`:
   * the "Reddit- Posts" dataset only accepts a single `url` input field (no
   * `sort_by`/`num_of_posts`/listing controls — those were rejected with
   * "should not contain a ... field" during testing) and always resolves to
   * exactly one representative post for that URL, not a sorted subreddit
   * listing. So this can only ever return 0-1 posts per call today; true
   * multi-post subreddit collection isn't supported by this dataset as
   * currently wired (would need Bright Data's separate Web Unlocker/proxy
   * product to fetch Reddit's own listing JSON instead — a follow-up, not
   * shipped here).
   */
  async fetchSubredditPosts(
    community: string,
    options: FetchSubredditPostsOptions,
  ): Promise<RawRedditPost[]> {
    const records = await this.client.collect<Record<string, any>>(
      BRIGHT_DATA_POSTS_DATASET_ID,
      [{ url: `https://www.reddit.com/r/${encodeURIComponent(community)}/` }],
    );

    return records
      .map((record) => this.mapPost(record, community))
      .filter((post) => {
        if (post.is_nsfw && !options.includeNsfw) return false;
        if (
          typeof options.minScore === 'number' &&
          post.score < options.minScore
        )
          return false;
        return true;
      })
      .slice(0, options.limit);
  }

  async fetchPostWithComments(
    community: string,
    postId: string,
    options: FetchPostWithCommentsOptions,
  ): Promise<{ post: RawRedditPost; comments: RawRedditComment[] }> {
    const postUrl = `https://www.reddit.com/r/${encodeURIComponent(community)}/comments/${encodeURIComponent(postId)}/`;

    const [postRecords, commentRecords] = await Promise.all([
      this.client.collect<Record<string, any>>(BRIGHT_DATA_POSTS_DATASET_ID, [
        { url: postUrl },
      ]),
      this.client.collect<Record<string, any>>(
        BRIGHT_DATA_COMMENTS_DATASET_ID,
        [{ url: postUrl }],
      ),
    ]);

    if (!postRecords[0]) {
      throw new Error('Bright Data returned no data for this post.');
    }

    const post = this.mapPost(postRecords[0], community);
    const comments = this.mapComments(commentRecords, options);

    return { post, comments };
  }

  async detectSource(url: string): Promise<RedditDetectSourceResult> {
    const urlInfo = parseRedditUrl(url);

    try {
      if (urlInfo.sourceType === SourceType.THREAD) {
        const [record] = await this.client.collect<Record<string, any>>(
          BRIGHT_DATA_POSTS_DATASET_ID,
          [
            {
              url: `https://www.reddit.com/r/${urlInfo.community}/comments/${urlInfo.externalPostId}/`,
            },
          ],
          { sync: true },
        );

        if (!record) {
          return {
            sourceType: urlInfo.sourceType,
            community: urlInfo.community,
            isPublic: false,
            error:
              'This post could not be found. It may have been deleted, or the link is out of date.',
          };
        }

        const post = this.mapPost(record, urlInfo.community);
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: true,
          title: post.title || undefined,
          bodyPreview: this.previewText(post.body),
          author: post.author ?? undefined,
          score: post.score,
          postCount: 1,
          commentCount: post.num_comments,
          postedAt: post.posted_at,
          flairs: post.flair ? [post.flair] : [],
        };
      }

      const records = await this.client.collect<Record<string, any>>(
        BRIGHT_DATA_POSTS_DATASET_ID,
        [{ url: `https://www.reddit.com/r/${urlInfo.community}/` }],
        { sync: true },
      );

      if (!records.length) {
        return {
          sourceType: urlInfo.sourceType,
          community: urlInfo.community,
          isPublic: false,
          error:
            'This subreddit could not be reached. It may be private, banned, or does not exist.',
        };
      }

      const posts = records.map((record) =>
        this.mapPost(record, urlInfo.community),
      );
      const flairs = Array.from(
        new Set(posts.map((p) => p.flair).filter((f): f is string => !!f)),
      ).slice(0, 6);

      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: true,
        title: `r/${urlInfo.community}`,
        bodyPreview: this.previewText(posts[0]?.title),
        flairs,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Bright Data detect-source failed: ${message}`);
      return {
        sourceType: urlInfo.sourceType,
        community: urlInfo.community,
        isPublic: false,
        error:
          'Reddit data could not be reached right now. Please try again in a moment.',
      };
    }
  }

  private mapPost(
    record: Record<string, any>,
    fallbackCommunity: string,
  ): RawRedditPost {
    const permalink = this.pick(record, ['url', 'post_url', 'permalink']) ?? '';
    const postedAtRaw = this.pick(record, [
      'date_posted',
      'created_at',
      'posted_at',
    ]);

    return {
      external_id: String(this.pick(record, ['post_id', 'id']) ?? ''),
      community:
        this.pick(record, ['community_name', 'subreddit']) ?? fallbackCommunity,
      title: this.pick(record, ['title']) ?? '',
      author: this.nullIfDeleted(
        this.pick(record, ['user_posted', 'author', 'username']),
      ),
      body: this.nullIfDeleted(
        this.pick(record, ['description', 'selftext', 'body']),
      ),
      url: permalink,
      permalink,
      score: this.toNumber(
        this.pick(record, ['num_upvotes', 'upvotes', 'score']),
      ),
      upvote_ratio: this.toNullableNumber(this.pick(record, ['upvote_ratio'])),
      num_comments: this.toNumber(
        this.pick(record, ['num_comments', 'number_of_comments']),
      ),
      flair: this.pick(record, ['tag', 'flair', 'link_flair_text']) ?? null,
      is_nsfw: !!this.pick(record, [
        'is_not_safe_for_work_post',
        'over_18',
        'is_nsfw',
        'nsfw',
      ]),
      is_deleted: this.pick(record, ['user_posted', 'author']) === '[deleted]',
      is_removed:
        this.pick(record, ['description', 'selftext']) === '[removed]',
      posted_at: postedAtRaw ? new Date(postedAtRaw) : new Date(0),
    };
  }

  private mapComments(
    records: Record<string, any>[],
    options: FetchPostWithCommentsOptions,
  ): RawRedditComment[] {
    const byId = new Map<string, Record<string, any>>();
    for (const record of records) {
      const id = String(this.pick(record, ['comment_id', 'id']) ?? '');
      if (id) byId.set(id, record);
    }

    const depthOf = (
      record: Record<string, any>,
      seen = new Set<string>(),
    ): number => {
      const explicitDepth = this.pick(record, ['depth', 'level']);
      if (typeof explicitDepth === 'number') return explicitDepth;

      const parentId = this.pick(record, [
        'parent_comment_id',
        'parent_id',
        'parentId',
      ]);
      const id = String(this.pick(record, ['comment_id', 'id']) ?? '');
      if (!parentId || !byId.has(String(parentId)) || seen.has(id)) return 0;

      seen.add(id);
      return 1 + depthOf(byId.get(String(parentId))!, seen);
    };

    const comments: RawRedditComment[] = [];

    for (const record of records) {
      if (options.maxComments && comments.length >= options.maxComments) break;

      const score = this.toNumber(
        this.pick(record, ['num_upvotes', 'upvotes', 'score']),
      );
      if (
        typeof options.minCommentScore === 'number' &&
        score < options.minCommentScore
      )
        continue;

      const depth = depthOf(record);
      if (typeof options.maxDepth === 'number' && depth > options.maxDepth)
        continue;

      const parentIdRaw = this.pick(record, [
        'parent_comment_id',
        'parent_id',
        'parentId',
      ]);
      const body = this.nullIfDeleted(
        this.pick(record, ['comment', 'body', 'text']),
      );

      comments.push({
        external_id: String(this.pick(record, ['comment_id', 'id']) ?? ''),
        parent_external_id:
          parentIdRaw && byId.has(String(parentIdRaw))
            ? String(parentIdRaw)
            : null,
        author: this.nullIfDeleted(
          this.pick(record, ['user_posted', 'author', 'username']),
        ),
        body,
        score,
        depth,
        permalink: this.pick(record, ['url', 'permalink']) ?? '',
        is_deleted:
          this.pick(record, ['user_posted', 'author']) === '[deleted]',
        is_removed:
          body === null &&
          this.pick(record, ['comment', 'body']) === '[removed]',
        posted_at: (() => {
          const raw = this.pick(record, [
            'date_posted',
            'created_at',
            'posted_at',
          ]);
          return raw ? new Date(raw) : new Date(0);
        })(),
      });
    }

    return comments;
  }

  private pick(record: Record<string, any>, keys: string[]): any {
    for (const key of keys) {
      if (
        record[key] !== undefined &&
        record[key] !== null &&
        record[key] !== ''
      ) {
        return record[key];
      }
    }
    return undefined;
  }

  private nullIfDeleted(value: unknown): string | null {
    if (typeof value !== 'string' || !value) return null;
    if (value === '[deleted]' || value === '[removed]') return null;
    return value;
  }

  private toNumber(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === undefined || value === null) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  private previewText(text: string | undefined | null): string | undefined {
    if (!text) return undefined;
    return text.length > 280 ? `${text.slice(0, 280)}…` : text;
  }
}
