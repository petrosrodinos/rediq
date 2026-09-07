import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    GetKnowledgeInsightsResponse,
    KnowledgeInsight,
    KnowledgeInsightQueryType,
} from "../interfaces/knowledge-insights.interfaces";

export const getKnowledgeInsights = async (
    researchProjectId: string,
    query?: KnowledgeInsightQueryType,
): Promise<GetKnowledgeInsightsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.knowledge_insights.by_research_project(researchProjectId), {
            params: query,
        });

        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch knowledge insights. Please try again.");
    }
};

export const getKnowledgeInsight = async (id: string): Promise<KnowledgeInsight> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.knowledge_insights.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch knowledge insight. Please try again.");
    }
};
