import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    CreateResearchProjectDto,
    ResearchProject,
    ResearchProjectListResponse,
    ResearchProjectQueryType,
    UpdateResearchProjectDto,
} from "../interfaces/research-projects.interfaces";

export const createResearchProject = async (dto: CreateResearchProjectDto): Promise<ResearchProject> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.research_projects.prefix, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to create research project. Please try again.");
    }
};

export const getResearchProjects = async (
    query?: ResearchProjectQueryType,
): Promise<ResearchProjectListResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.research_projects.prefix, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch research projects. Please try again.");
    }
};

export const getResearchProject = async (id: string): Promise<ResearchProject> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.research_projects.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch research project. Please try again.");
    }
};

export const updateResearchProject = async (
    id: string,
    dto: UpdateResearchProjectDto,
): Promise<ResearchProject> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.research_projects.by_id(id), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update research project. Please try again.");
    }
};

export const deleteResearchProject = async (id: string): Promise<ResearchProject> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.research_projects.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete research project. Please try again.");
    }
};
