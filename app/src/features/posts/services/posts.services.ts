import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { GetPostsResponse, PostDetail, PostQueryType } from "../interfaces/posts.interfaces";

export const getPosts = async (researchProjectId: string, query?: PostQueryType): Promise<GetPostsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.posts.by_research_project(researchProjectId), { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch posts. Please try again.");
    }
};

export const getPost = async (id: string): Promise<PostDetail> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.posts.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch post. Please try again.");
    }
};
