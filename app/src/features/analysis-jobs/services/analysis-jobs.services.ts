import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    AnalysisJob,
    AnalysisJobListResponse,
    AnalysisJobQueryType,
    BatchSubmissionListResponse,
    BatchSubmissionQueryType,
    CreateAnalysisJobDto,
} from "../interfaces/analysis-jobs.interfaces";

export const createAnalysisJob = async (
    researchProjectId: string,
    dto: CreateAnalysisJobDto,
): Promise<AnalysisJob> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.analysis_jobs.by_research_project(researchProjectId), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to create analysis job. Please try again.");
    }
};

export const getAnalysisJobs = async (
    researchProjectId: string,
    query?: AnalysisJobQueryType,
): Promise<AnalysisJobListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.analysis_jobs.by_research_project(researchProjectId), {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis jobs. Please try again.");
    }
};

export const getAnalysisJob = async (id: string): Promise<AnalysisJob> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.analysis_jobs.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis job. Please try again.");
    }
};

export const cancelAnalysisJob = async (id: string): Promise<AnalysisJob> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.analysis_jobs.cancel(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to cancel analysis job. Please try again.");
    }
};

export const getAnalysisJobBatchSubmissions = async (
    id: string,
    query?: BatchSubmissionQueryType,
): Promise<BatchSubmissionListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.analysis_jobs.batch_submissions(id), { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis job batch submissions. Please try again.");
    }
};
