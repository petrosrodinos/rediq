import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export interface SavedInsightTopic {
    id: string;
    research_project_uuid: string;
    name: string;
    summary?: string | null;
    created_at: string;
    updated_at: string;
}

export interface SavedInsightCitation {
    id: string;
    knowledge_insight_uuid: string;
    post_uuid?: string | null;
    comment_uuid?: string | null;
    knowledge_chunk_uuid?: string | null;
    excerpt?: string | null;
    created_at: string;
}

export interface SavedInsightKnowledgeInsight {
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
    citations: SavedInsightCitation[];
    topic?: SavedInsightTopic | null;
}

export interface SavedInsight {
    id: string;
    user_uuid: string;
    research_project_uuid: string;
    knowledge_insight_uuid: string;
    collection_uuid: string | null;
    created_at: string;
    knowledge_insight: SavedInsightKnowledgeInsight;
}

export interface CreateSavedInsightDto {
    research_project_uuid: string;
    knowledge_insight_uuid: string;
    collection_uuid?: string | null;
}

export interface UpdateSavedInsightDto {
    collection_uuid?: string | null;
}

export interface SavedInsightQueryType {
    page?: number;
    limit?: number;
    research_project_uuid?: string;
    collection_uuid?: string;
}

export interface GetSavedInsightsResponse {
    data: SavedInsight[];
    pagination: Pagination;
}

export interface DeleteSavedInsightResponse {
    success: boolean;
}

export interface SavedInsightCollection {
    id: string;
    user_uuid: string;
    name: string;
    saved_insight_count?: number;
    created_at: string;
    updated_at: string;
}

export interface CreateSavedInsightCollectionDto {
    name: string;
}

export interface UpdateSavedInsightCollectionDto {
    name: string;
}

export interface DeleteSavedInsightCollectionResponse {
    success: boolean;
}
