import type { Pagination } from "@/interfaces/pagination/pagination.interface";
import type { Comment } from "@/features/comments/interfaces/comments.interfaces";

export interface Post {
    id: string;
    research_project_uuid: string;
    platform: string;
    external_id: string;
    community: string;
    title: string;
    author?: string | null;
    body?: string | null;
    url: string;
    permalink: string;
    score: number;
    upvote_ratio?: number | null;
    num_comments: number;
    flair?: string | null;
    is_nsfw: boolean;
    is_deleted: boolean;
    is_removed: boolean;
    posted_at: string;
    fetched_at: string;
    created_at: string;
    updated_at: string;
}

export interface PostDetail extends Post {
    comments: Comment[];
}

export const PostOrderByFields = {
    SCORE: "score",
    POSTED_AT: "posted_at",
    NUM_COMMENTS: "num_comments",
    CREATED_AT: "created_at",
} as const;

export type PostOrderByField = (typeof PostOrderByFields)[keyof typeof PostOrderByFields];

export const PostOrderDirections = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type PostOrderDirection = (typeof PostOrderDirections)[keyof typeof PostOrderDirections];

export interface PostQueryType {
    page?: number;
    limit?: number;
    community?: string;
    min_score?: number;
    is_nsfw?: boolean;
    search?: string;
    order_by?: PostOrderByField;
    order_direction?: PostOrderDirection;
}

export interface GetPostsResponse {
    data: Post[];
    pagination: Pagination;
}
