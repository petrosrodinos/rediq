import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { GetTopicsResponse, TopicDetail, TopicQueryType } from "../interfaces/topics.interfaces";

export const getTopics = async (researchProjectId: string, query?: TopicQueryType): Promise<GetTopicsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.topics.by_research_project(researchProjectId), { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch topics. Please try again.");
    }
};

export const getTopic = async (id: string): Promise<TopicDetail> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.topics.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch topic. Please try again.");
    }
};
