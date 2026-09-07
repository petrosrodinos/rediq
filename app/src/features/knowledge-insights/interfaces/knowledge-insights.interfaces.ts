import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export const InsightType = {
    KEY_INSIGHT: "KEY_INSIGHT",
    PROBLEM: "PROBLEM",
    SOLUTION: "SOLUTION",
    OPINION: "OPINION",
    CONSENSUS: "CONSENSUS",
    CONTRADICTION: "CONTRADICTION",
    USER_EXPERIENCE: "USER_EXPERIENCE",
    PRODUCT_MENTION: "PRODUCT_MENTION",
    FAQ: "FAQ",
    STATISTIC: "STATISTIC",
    TREND: "TREND",
    RECOMMENDATION: "RECOMMENDATION",
    ARGUMENT: "ARGUMENT",
} as const;

export type InsightTypeType = (typeof InsightType)[keyof typeof InsightType];

export const SentimentLabel = {
    POSITIVE: "POSITIVE",
    NEUTRAL: "NEUTRAL",
    NEGATIVE: "NEGATIVE",
} as const;

export type SentimentLabelType = (typeof SentimentLabel)[keyof typeof SentimentLabel];

export interface KnowledgeInsightTopic {
    id: string;
    research_project_uuid: string;
    name: string;
    summary?: string | null;
    created_at: string;
    updated_at: string;
}

export interface KnowledgeInsightCitationPost {
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

export interface KnowledgeInsightCitationComment {
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

/**
 * Citation shape as returned when listing insights (`GET .../knowledge-insights`) —
 * `post` / `comment` are NOT populated there (only `citations: true` is included).
 * When fetching a single insight (`GET /knowledge-insights/:id`), the API also
 * includes the related `post` and `comment` records on each citation.
 */
export interface KnowledgeInsightCitation {
    id: string;
    knowledge_insight_uuid: string;
    post_uuid?: string | null;
    comment_uuid?: string | null;
    knowledge_chunk_uuid?: string | null;
    excerpt?: string | null;
    created_at: string;
    post?: KnowledgeInsightCitationPost | null;
    comment?: KnowledgeInsightCitationComment | null;
}

export interface KnowledgeInsight {
    id: string;
    research_project_uuid: string;
    analysis_job_uuid?: string | null;
    topic_uuid?: string | null;
    type: InsightTypeType;
    title: string;
    content: string;
    confidence_score?: number | null;
    supporting_count: number;
    sentiment?: SentimentLabelType | null;
    sentiment_score?: number | null;
    metadata?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    citations: KnowledgeInsightCitation[];
    topic?: KnowledgeInsightTopic | null;
}

export const KnowledgeInsightOrderByFields = {
    CONFIDENCE_SCORE: "confidence_score",
    SUPPORTING_COUNT: "supporting_count",
    CREATED_AT: "created_at",
} as const;

export type KnowledgeInsightOrderByField = (typeof KnowledgeInsightOrderByFields)[keyof typeof KnowledgeInsightOrderByFields];

export const KnowledgeInsightOrderDirections = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type KnowledgeInsightOrderDirection = (typeof KnowledgeInsightOrderDirections)[keyof typeof KnowledgeInsightOrderDirections];

export interface KnowledgeInsightQueryType {
    page?: number;
    limit?: number;
    type?: InsightTypeType;
    sentiment?: SentimentLabelType;
    topic_uuid?: string;
    min_confidence?: number;
    search?: string;
    order_by?: KnowledgeInsightOrderByField;
    order_direction?: KnowledgeInsightOrderDirection;
}

export interface GetKnowledgeInsightsResponse {
    data: KnowledgeInsight[];
    pagination: Pagination;
}
