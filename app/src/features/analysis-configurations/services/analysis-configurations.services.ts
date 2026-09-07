import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    AnalysisConfiguration,
    AnalysisConfigurationListResponse,
    AnalysisConfigurationQueryType,
    CreateAnalysisConfigurationDto,
    UpdateAnalysisConfigurationDto,
} from "../interfaces/analysis-configurations.interfaces";

export const createAnalysisConfiguration = async (
    researchProjectId: string,
    dto: CreateAnalysisConfigurationDto,
): Promise<AnalysisConfiguration> => {
    try {
        const response = await axiosInstance.post(
            ApiRoutes.analysis_configurations.by_research_project(researchProjectId),
            dto,
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to create analysis configuration. Please try again.");
    }
};

export const getAnalysisConfigurations = async (
    researchProjectId: string,
    query?: AnalysisConfigurationQueryType,
): Promise<AnalysisConfigurationListResponse> => {
    try {
        const response = await axiosInstance.get(
            ApiRoutes.analysis_configurations.by_research_project(researchProjectId),
            { params: query },
        );
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis configurations. Please try again.");
    }
};

export const getAnalysisConfiguration = async (id: string): Promise<AnalysisConfiguration> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.analysis_configurations.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch analysis configuration. Please try again.");
    }
};

export const updateAnalysisConfiguration = async (
    id: string,
    dto: UpdateAnalysisConfigurationDto,
): Promise<AnalysisConfiguration> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.analysis_configurations.by_id(id), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update analysis configuration. Please try again.");
    }
};

export const deleteAnalysisConfiguration = async (id: string): Promise<AnalysisConfiguration> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.analysis_configurations.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete analysis configuration. Please try again.");
    }
};
