import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateSavedInsightDto,
    DeleteSavedInsightResponse,
    GetSavedInsightsResponse,
    SavedInsight,
    SavedInsightQueryType,
} from "../interfaces/saved-insights.interfaces";

export const createSavedInsight = async (dto: CreateSavedInsightDto): Promise<SavedInsight> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.saved_insights.prefix, dto);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to save insight. Please try again.");
    }
};

export const getSavedInsights = async (query?: SavedInsightQueryType): Promise<GetSavedInsightsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.saved_insights.prefix, { params: query });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch saved insights. Please try again.");
    }
};

export const deleteSavedInsight = async (id: string): Promise<DeleteSavedInsightResponse> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.saved_insights.by_id(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to unsave insight. Please try again.");
    }
};
