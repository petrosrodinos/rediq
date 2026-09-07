import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export interface Comment {
    id: string;
    research_project_uuid: string;
    post_uuid: string;
    external_id: string;
    parent_external_id?: string | null;
    parent_comment_uuid?: string | null;
    author?: string | null;
    body?: string | null;
    score: number;
    depth: number;
    permalink: string;
    is_deleted: boolean;
    is_removed: boolean;
    posted_at: string;
    fetched_at: string;
    created_at: string;
    updated_at: string;
}

export interface CommentDetail extends Comment {
    replies: Comment[];
}

export const CommentOrderByFields = {
    SCORE: "score",
    POSTED_AT: "posted_at",
    DEPTH: "depth",
} as const;

export type CommentOrderByField = (typeof CommentOrderByFields)[keyof typeof CommentOrderByFields];

export const CommentOrderDirections = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type CommentOrderDirection = (typeof CommentOrderDirections)[keyof typeof CommentOrderDirections];

export interface CommentQueryType {
    page?: number;
    limit?: number;
    min_score?: number;
    order_by?: CommentOrderByField;
    order_direction?: CommentOrderDirection;
}

export interface GetCommentsResponse {
    data: Comment[];
    pagination: Pagination;
}
