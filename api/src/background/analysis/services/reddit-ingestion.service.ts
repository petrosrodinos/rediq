import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/core/databases/prisma/prisma.service';
import { RedditService } from '@/integrations/reddit/services/reddit.service';
import { AnalysisConfiguration, ResearchSource } from 'generated/prisma';
import {
  RawRedditComment,
  RawRedditPost,
} from '@/integrations/reddit/interfaces/reddit.interfaces';

export interface IngestionResult {
  postIds: string[];
  commentIds: string[];
}

const MAX_POSTS_DEFAULT = 50;

@Injectable()
export class RedditIngestionService {
  private readonly logger = new Logger(RedditIngestionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redditService: RedditService,
  ) {}

  async ingest(
    researchProjectId: string,
    source: ResearchSource,
    configuration: AnalysisConfiguration,
    onProgress: (
      postsProcessed: number,
      postsTotal: number,
      commentsProcessed: number,
      commentsTotal: number,
    ) => Promise<void>,
  ): Promise<IngestionResult> {
    const postIds: string[] = [];
    const commentIds: string[] = [];

    if (source.source_type === 'THREAD') {
      const { post, comments } = await this.redditService.fetchPostWithComments(
        source.community,
        source.external_post_id!,
        {
          maxComments: configuration.max_comments ?? undefined,
          maxDepth: configuration.max_comment_depth ?? undefined,
          minCommentScore: configuration.min_comment_score ?? undefined,
        },
      );

      await onProgress(0, 1, 0, comments.length);
      const postId = await this.storePost(researchProjectId, post);
      postIds.push(postId);

      const newCommentIds = await this.storeComments(
        researchProjectId,
        postId,
        comments,
      );
      commentIds.push(...newCommentIds);

      await onProgress(1, 1, comments.length, comments.length);
      return { postIds, commentIds };
    }

    const posts = await this.redditService.fetchSubredditPosts(
      source.community,
      {
        sort: configuration.sort_order,
        topTimeRange: configuration.top_time_range ?? undefined,
        limit: configuration.max_posts ?? MAX_POSTS_DEFAULT,
        minScore: configuration.min_post_score ?? undefined,
        includeNsfw: configuration.include_nsfw,
      },
    );

    let commentsProcessed = 0;
    const estimatedCommentsTotal =
      posts.length * (configuration.max_comments_per_post ?? 20);

    for (const [index, rawPost] of posts.entries()) {
      try {
        const postId = await this.storePost(researchProjectId, rawPost);
        postIds.push(postId);

        if (configuration.include_replies !== false) {
          const { comments } = await this.redditService.fetchPostWithComments(
            source.community,
            rawPost.external_id,
            {
              maxComments: configuration.max_comments_per_post ?? undefined,
              maxDepth: configuration.max_comment_depth ?? undefined,
              minCommentScore: configuration.min_comment_score ?? undefined,
            },
          );

          const newCommentIds = await this.storeComments(
            researchProjectId,
            postId,
            comments,
          );
          commentIds.push(...newCommentIds);
          commentsProcessed += comments.length;
        }
      } catch (error) {
        this.logger.warn(
          `Failed to ingest post ${rawPost.external_id}: ${error.message}`,
        );
      }

      await onProgress(
        index + 1,
        posts.length,
        commentsProcessed,
        estimatedCommentsTotal,
      );
    }

    return { postIds, commentIds };
  }

  private async storePost(
    researchProjectId: string,
    raw: RawRedditPost,
  ): Promise<string> {
    const post = await this.prisma.post.upsert({
      where: {
        research_project_uuid_external_id: {
          research_project_uuid: researchProjectId,
          external_id: raw.external_id,
        },
      },
      create: {
        research_project_uuid: researchProjectId,
        external_id: raw.external_id,
        community: raw.community,
        title: raw.title,
        author: raw.author,
        body: raw.body,
        url: raw.url,
        permalink: raw.permalink,
        score: raw.score,
        upvote_ratio: raw.upvote_ratio,
        num_comments: raw.num_comments,
        flair: raw.flair,
        is_nsfw: raw.is_nsfw,
        is_deleted: raw.is_deleted,
        is_removed: raw.is_removed,
        posted_at: raw.posted_at,
      },
      update: {
        score: raw.score,
        num_comments: raw.num_comments,
        is_deleted: raw.is_deleted,
        is_removed: raw.is_removed,
      },
    });

    return post.id;
  }

  private async storeComments(
    researchProjectId: string,
    postId: string,
    comments: RawRedditComment[],
  ): Promise<string[]> {
    const externalIdToId = new Map<string, string>();
    const ids: string[] = [];

    for (const raw of comments) {
      const parentId = raw.parent_external_id
        ? (externalIdToId.get(raw.parent_external_id) ?? null)
        : null;

      const comment = await this.prisma.comment.upsert({
        where: {
          research_project_uuid_external_id: {
            research_project_uuid: researchProjectId,
            external_id: raw.external_id,
          },
        },
        create: {
          research_project_uuid: researchProjectId,
          post_uuid: postId,
          external_id: raw.external_id,
          parent_external_id: raw.parent_external_id,
          parent_comment_uuid: parentId,
          author: raw.author,
          body: raw.body,
          score: raw.score,
          depth: raw.depth,
          permalink: raw.permalink,
          is_deleted: raw.is_deleted,
          is_removed: raw.is_removed,
          posted_at: raw.posted_at,
        },
        update: {
          score: raw.score,
          is_deleted: raw.is_deleted,
          is_removed: raw.is_removed,
        },
      });

      externalIdToId.set(raw.external_id, comment.id);
      ids.push(comment.id);
    }

    return ids;
  }
}
