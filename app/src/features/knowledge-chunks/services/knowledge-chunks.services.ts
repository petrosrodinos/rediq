import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { GetKnowledgeChunksResponse, KnowledgeChunkQueryType } from "../interfaces/knowledge-chunks.interfaces";

export const getKnowledgeChunks = async (
    researchProjectId: string,
    query?: KnowledgeChunkQueryType,
): Promise<GetKnowledgeChunksResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.knowledge_chunks.by_research_project(researchProjectId), {
            params: query,
        });

        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch knowledge chunks. Please try again.");
    }
};
