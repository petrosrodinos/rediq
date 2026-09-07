import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export interface Topic {
    id: string;
    research_project_uuid: string;
    name: string;
    summary?: string | null;
    created_at: string;
    updated_at: string;
}

export interface TopicListItem extends Topic {
    _count: {
        knowledge_insights: number;
    };
}

export interface TopicCitation {
    id: string;
    knowledge_insight_uuid: string;
    post_uuid?: string | null;
    comment_uuid?: string | null;
    knowledge_chunk_uuid?: string | null;
    excerpt?: string | null;
    created_at: string;
}

export interface TopicKnowledgeInsight {
    id: string;
    research_project_uuid: string;
    analysis_job_uuid?: string | null;
    topic_uuid?: string | null;
    type: string;
    title: string;
    content: string;
    confidence_score?: number | null;
    supporting_count: number;
    metadata?: Record<string, any> | null;
    created_at: string;
    updated_at: string;
    citations: TopicCitation[];
}

export interface TopicDetail extends Topic {
    knowledge_insights: TopicKnowledgeInsight[];
}

export const TopicOrderByFields = {
    NAME: "name",
    CREATED_AT: "created_at",
} as const;

export type TopicOrderByField = (typeof TopicOrderByFields)[keyof typeof TopicOrderByFields];

export const TopicOrderDirections = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type TopicOrderDirection = (typeof TopicOrderDirections)[keyof typeof TopicOrderDirections];

export interface TopicQueryType {
    page?: number;
    limit?: number;
    search?: string;
    order_by?: TopicOrderByField;
    order_direction?: TopicOrderDirection;
}

export interface GetTopicsResponse {
    data: TopicListItem[];
    pagination: Pagination;
}
