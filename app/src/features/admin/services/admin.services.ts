import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    AdminAnalysisJobListResponse,
    AdminAnalysisJobQueryType,
    AdminQueueStatus,
    AdminResearchProjectListResponse,
    AdminResearchProjectQueryType,
    AdminStats,
    AdminSystemErrorListResponse,
    AdminSystemErrorQueryType,
    AdminUser,
    AdminUserListResponse,
    AdminUserQueryType,
} from "../interfaces/admin.interfaces";

export const getAdminStats = async (): Promise<AdminStats> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.stats);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch admin stats. Please try again.");
    }
};

export const getAdminUsers = async (query?: AdminUserQueryType): Promise<AdminUserListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.users.prefix, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch users. Please try again.");
    }
};

export const getAdminUser = async (id: string): Promise<AdminUser> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.users.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch user. Please try again.");
    }
};

export const getAdminResearchProjects = async (
    query?: AdminResearchProjectQueryType,
): Promise<AdminResearchProjectListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.research_projects, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch research projects. Please try again.");
    }
};

export const getAdminAnalysisJobs = async (
    query?: AdminAnalysisJobQueryType,
): Promise<AdminAnalysisJobListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.analysis_jobs, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis jobs. Please try again.");
    }
};

export const getAdminSystemErrors = async (
    query?: AdminSystemErrorQueryType,
): Promise<AdminSystemErrorListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.system_errors, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch system errors. Please try again.");
    }
};

export const getAdminQueueStatus = async (): Promise<AdminQueueStatus> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.queue);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch queue status. Please try again.");
    }
};
