import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateSavedSearchDto,
    DeleteSavedSearchResponse,
    GetSavedSearchesResponse,
    SavedSearch,
    SavedSearchQueryType,
} from "../interfaces/saved-searches.interfaces";

export const createSavedSearch = async (dto: CreateSavedSearchDto): Promise<SavedSearch> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.saved_searches.prefix, dto);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to save this search. Please try again.");
    }
};

export const getSavedSearches = async (query?: SavedSearchQueryType): Promise<GetSavedSearchesResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.saved_searches.prefix, { params: query });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch saved searches. Please try again.");
    }
};

export const deleteSavedSearch = async (id: string): Promise<DeleteSavedSearchResponse> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.saved_searches.by_id(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete saved search. Please try again.");
    }
};
