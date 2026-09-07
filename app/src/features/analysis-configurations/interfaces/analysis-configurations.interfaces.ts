import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export const ProcessingMode = {
    STANDARD: "STANDARD",
    BATCH: "BATCH",
} as const;
export type ProcessingModeType = (typeof ProcessingMode)[keyof typeof ProcessingMode];

export const PostSortOrder = {
    HOT: "HOT",
    TOP: "TOP",
    NEW: "NEW",
    RISING: "RISING",
    CONTROVERSIAL: "CONTROVERSIAL",
} as const;
export type PostSortOrderType = (typeof PostSortOrder)[keyof typeof PostSortOrder];

export const TopTimeRange = {
    HOUR: "HOUR",
    DAY: "DAY",
    WEEK: "WEEK",
    MONTH: "MONTH",
    YEAR: "YEAR",
    ALL: "ALL",
} as const;
export type TopTimeRangeType = (typeof TopTimeRange)[keyof typeof TopTimeRange];

export interface AnalysisConfiguration {
    id: string;
    research_project_uuid: string;
    processing_mode: ProcessingModeType;
    sort_order: PostSortOrderType;
    top_time_range: TopTimeRangeType | null;
    max_posts: number | null;
    max_comments_per_post: number | null;
    max_comments: number | null;
    max_comment_depth: number | null;
    min_post_score: number | null;
    min_comment_score: number | null;
    include_replies: boolean;
    include_nsfw: boolean;
    include_controversial: boolean;
    analyze_deleted_when_unavailable: boolean;
    prioritize_engagement: boolean;
    prioritize_recent: boolean;
    prioritize_popular: boolean;
    prioritize_top_comments: boolean;
    analyze_entire_discussion: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateAnalysisConfigurationDto {
    processing_mode?: ProcessingModeType;
    sort_order?: PostSortOrderType;
    top_time_range?: TopTimeRangeType;
    max_posts?: number;
    max_comments_per_post?: number;
    max_comments?: number;
    max_comment_depth?: number;
    min_post_score?: number;
    min_comment_score?: number;
    include_replies?: boolean;
    include_nsfw?: boolean;
    include_controversial?: boolean;
    analyze_deleted_when_unavailable?: boolean;
    prioritize_engagement?: boolean;
    prioritize_recent?: boolean;
    prioritize_popular?: boolean;
    prioritize_top_comments?: boolean;
    analyze_entire_discussion?: boolean;
}

export type UpdateAnalysisConfigurationDto = Partial<CreateAnalysisConfigurationDto>;

export interface AnalysisConfigurationQueryType {
    page?: number;
    limit?: number;
    order_by?: "created_at";
    order_direction?: "asc" | "desc";
}

export interface AnalysisConfigurationListResponse {
    data: AnalysisConfiguration[];
    pagination: Pagination;
}
