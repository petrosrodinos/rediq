import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { SearchDto, SemanticSearchResult } from "../interfaces/search.interfaces";

export const searchResearchProject = async (
    researchProjectId: string,
    dto: SearchDto,
): Promise<SemanticSearchResult[]> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.search.by_research_project(researchProjectId), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to search research project. Please try again.");
    }
};
