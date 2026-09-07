import type { Pagination } from "@/interfaces/pagination/pagination.interface";
import type {
    AnalysisConfiguration,
    CreateAnalysisConfigurationDto,
} from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import type { AnalysisJob } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";

export const AnalysisStatus = {
    PENDING: "PENDING",
    COLLECTING_DATA: "COLLECTING_DATA",
    FILTERING: "FILTERING",
    PROCESSING: "PROCESSING",
    GENERATING_EMBEDDINGS: "GENERATING_EMBEDDINGS",
    EXTRACTING_KNOWLEDGE: "EXTRACTING_KNOWLEDGE",
    AWAITING_BATCH_COMPLETION: "AWAITING_BATCH_COMPLETION",
    SYNTHESIZING: "SYNTHESIZING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
} as const;
export type AnalysisStatusType = (typeof AnalysisStatus)[keyof typeof AnalysisStatus];

export const SourcePlatform = {
    REDDIT: "REDDIT",
} as const;
export type SourcePlatformType = (typeof SourcePlatform)[keyof typeof SourcePlatform];

export const SourceType = {
    COMMUNITY: "COMMUNITY",
    THREAD: "THREAD",
} as const;
export type SourceTypeType = (typeof SourceType)[keyof typeof SourceType];

export interface ResearchSource {
    id: string;
    research_project_uuid: string;
    platform: SourcePlatformType;
    source_type: SourceTypeType;
    url: string;
    community: string;
    external_post_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface ResearchProject {
    id: string;
    user_uuid: string;
    name: string;
    status: AnalysisStatusType;
    posts_analyzed: number;
    comments_analyzed: number;
    created_at: string;
    updated_at: string;
    source?: ResearchSource;
    analysis_configurations?: AnalysisConfiguration[];
    analysis_jobs?: AnalysisJob[];
}

export interface CreateResearchProjectDto {
    name: string;
    url: string;
    configuration?: CreateAnalysisConfigurationDto;
}

export interface UpdateResearchProjectDto {
    name: string;
}

export interface ResearchProjectQueryType {
    page?: number;
    limit?: number;
    search?: string;
    status?: AnalysisStatusType;
    order_by?: "created_at" | "updated_at" | "name";
    order_direction?: "asc" | "desc";
}

export interface ResearchProjectListResponse {
    data: ResearchProject[];
    pagination: Pagination;
}
