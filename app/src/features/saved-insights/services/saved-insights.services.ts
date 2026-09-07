import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateSavedInsightCollectionDto,
    CreateSavedInsightDto,
    DeleteSavedInsightCollectionResponse,
    DeleteSavedInsightResponse,
    GetSavedInsightsResponse,
    SavedInsight,
    SavedInsightCollection,
    SavedInsightQueryType,
    UpdateSavedInsightCollectionDto,
    UpdateSavedInsightDto,
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

export const updateSavedInsight = async (id: string, dto: UpdateSavedInsightDto): Promise<SavedInsight> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.saved_insights.by_id(id), dto);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update saved insight. Please try again.");
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

export const createSavedInsightCollection = async (
    dto: CreateSavedInsightCollectionDto,
): Promise<SavedInsightCollection> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.saved_insight_collections.prefix, dto);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to create collection. Please try again.");
    }
};

export const getSavedInsightCollections = async (): Promise<SavedInsightCollection[]> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.saved_insight_collections.prefix);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch collections. Please try again.");
    }
};

export const updateSavedInsightCollection = async (
    id: string,
    dto: UpdateSavedInsightCollectionDto,
): Promise<SavedInsightCollection> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.saved_insight_collections.by_id(id), dto);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to rename collection. Please try again.");
    }
};

export const deleteSavedInsightCollection = async (id: string): Promise<DeleteSavedInsightCollectionResponse> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.saved_insight_collections.by_id(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete collection. Please try again.");
    }
};
