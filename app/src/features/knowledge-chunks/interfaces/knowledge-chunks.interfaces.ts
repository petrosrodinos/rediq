import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export interface KnowledgeChunk {
    id: string;
    research_project_uuid: string;
    analysis_job_uuid: string;
    post_uuid?: string | null;
    comment_uuid?: string | null;
    content: string;
    token_count?: number | null;
    chunk_index: number;
    created_at: string;
    updated_at: string;
}

export interface KnowledgeChunkQueryType {
    page?: number;
    limit?: number;
}

export interface GetKnowledgeChunksResponse {
    data: KnowledgeChunk[];
    pagination: Pagination;
}
