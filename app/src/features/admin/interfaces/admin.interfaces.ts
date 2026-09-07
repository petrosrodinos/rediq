import type { Pagination } from "@/interfaces/pagination/pagination.interface";
import type { RoleType } from "@/features/user/interfaces/user.interface";
import type { AnalysisStatusType, ResearchSource } from "@/features/research-projects/interfaces/research-projects.interfaces";
import type { AnalysisConfiguration } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import type { JobEventLevelType } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";

export interface AdminUser {
    id: string;
    email: string;
    phone: string | null;
    role: RoleType;
    created_at: string;
    updated_at: string;
    research_project_count: number;
}

export interface AdminUserQueryType {
    page?: number;
    limit?: number;
    search?: string;
}

export interface AdminUserListResponse {
    data: AdminUser[];
    pagination: Pagination;
}

export interface AdminOwnerSummary {
    id: string;
    email: string;
}

export interface AdminResearchProject {
    id: string;
    user_uuid: string;
    name: string;
    status: AnalysisStatusType;
    posts_analyzed: number;
    comments_analyzed: number;
    created_at: string;
    updated_at: string;
    user: AdminOwnerSummary;
    source?: ResearchSource | null;
}

export interface AdminResearchProjectQueryType {
    page?: number;
    limit?: number;
    status?: AnalysisStatusType;
    search?: string;
}

export interface AdminResearchProjectListResponse {
    data: AdminResearchProject[];
    pagination: Pagination;
}

export interface AdminAnalysisJob {
    id: string;
    research_project_uuid: string;
    analysis_configuration_uuid: string;
    status: AnalysisStatusType;
    current_step: string | null;
    posts_processed: number;
    posts_total: number;
    comments_processed: number;
    comments_total: number;
    prompt_tokens: number;
    completion_tokens: number;
    estimated_cost_usd: number | null;
    actual_cost_usd: number | null;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    configuration?: AnalysisConfiguration;
    research_project: {
        id: string;
        name: string;
        user: AdminOwnerSummary;
    };
}

export interface AdminAnalysisJobQueryType {
    page?: number;
    limit?: number;
    status?: AnalysisStatusType;
    processing_mode?: string;
}

export interface AdminAnalysisJobListResponse {
    data: AdminAnalysisJob[];
    pagination: Pagination;
}

export interface AdminStats {
    users_count: number;
    research_projects_count: number;
    analysis_jobs_count: number;
    tokens_this_month: number;
    estimated_cost_usd_this_month: number;
    actual_cost_usd_this_month: number;
}

export interface AdminSystemError {
    id: string;
    analysis_job_uuid: string;
    step: string;
    message: string;
    level: JobEventLevelType;
    metadata?: Record<string, any> | null;
    created_at: string;
    analysis_job: {
        id: string;
        research_project: {
            id: string;
            name: string;
            user: AdminOwnerSummary;
        };
    };
}

export interface AdminSystemErrorQueryType {
    page?: number;
    limit?: number;
    level?: JobEventLevelType;
}

export interface AdminSystemErrorListResponse {
    data: AdminSystemError[];
    pagination: Pagination;
}

export interface AdminQueueStatus {
    queue_name: string;
    job_counts: Record<string, number>;
    analysis_job_status_counts: Partial<Record<AnalysisStatusType, number>>;
}
