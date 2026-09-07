import type { Pagination } from "@/interfaces/pagination/pagination.interface";
import type { AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";
import type { AnalysisConfiguration } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

export const BatchSubmissionStatus = {
    VALIDATING: "VALIDATING",
    IN_PROGRESS: "IN_PROGRESS",
    FINALIZING: "FINALIZING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED",
} as const;
export type BatchSubmissionStatusType = (typeof BatchSubmissionStatus)[keyof typeof BatchSubmissionStatus];

export interface BatchSubmission {
    id: string;
    analysis_job_uuid: string;
    openai_batch_id: string;
    status: BatchSubmissionStatusType;
    request_file_id: string | null;
    response_file_id: string | null;
    error_file_id: string | null;
    submitted_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface AnalysisJob {
    id: string;
    research_project_uuid: string;
    analysis_configuration_uuid: string;
    status: AnalysisStatusType;
    current_step: string | null;
    posts_processed: number;
    posts_total: number;
    comments_processed: number;
    comments_total: number;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    configuration?: AnalysisConfiguration;
    batch_submissions?: BatchSubmission[];
}

export interface CreateAnalysisJobDto {
    analysis_configuration_uuid: string;
}

export interface AnalysisJobQueryType {
    page?: number;
    limit?: number;
    status?: AnalysisStatusType;
    order_by?: "created_at" | "updated_at";
    order_direction?: "asc" | "desc";
}

export interface BatchSubmissionQueryType {
    page?: number;
    limit?: number;
    order_by?: "created_at";
    order_direction?: "asc" | "desc";
}

export interface AnalysisJobListResponse {
    data: AnalysisJob[];
    pagination: Pagination;
}

export interface BatchSubmissionListResponse {
    data: BatchSubmission[];
    pagination: Pagination;
}
