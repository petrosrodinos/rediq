import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { ExportQueryType, ExportReport } from "../interfaces/export.interfaces";

// The API returns a JSON ExportReport when format is "json" (default) and a
// plain markdown string when format is "markdown", so the resolved type is a union.
export const exportResearchProject = async (
    researchProjectId: string,
    query?: ExportQueryType,
): Promise<ExportReport | string> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.export.by_research_project(researchProjectId), {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to export research project. Please try again.");
    }
};
