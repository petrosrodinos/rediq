export type RedditSourceType = 'COMMUNITY' | 'THREAD';

export interface RedditUrlInfo {
  sourceType: RedditSourceType;
  community: string;
  externalPostId?: string;
}

export interface RawRedditPost {
  external_id: string;
  community: string;
  title: string;
  author: string | null;
  body: string | null;
  url: string;
  permalink: string;
  score: number;
  upvote_ratio: number | null;
  num_comments: number;
  flair: string | null;
  is_nsfw: boolean;
  is_deleted: boolean;
  is_removed: boolean;
  posted_at: Date;
}

export interface RawRedditComment {
  external_id: string;
  parent_external_id: string | null;
  author: string | null;
  body: string | null;
  score: number;
  depth: number;
  permalink: string;
  is_deleted: boolean;
  is_removed: boolean;
  posted_at: Date;
}

export type RedditPostSort = 'HOT' | 'TOP' | 'NEW' | 'RISING' | 'CONTROVERSIAL';
export type RedditTopTimeRange =
  | 'HOUR'
  | 'DAY'
  | 'WEEK'
  | 'MONTH'
  | 'YEAR'
  | 'ALL';

export interface FetchSubredditPostsOptions {
  sort: RedditPostSort;
  topTimeRange?: RedditTopTimeRange;
  limit: number;
  minScore?: number;
  includeNsfw?: boolean;
}

export interface FetchPostWithCommentsOptions {
  maxComments?: number;
  maxDepth?: number;
  minCommentScore?: number;
}
