import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { CommentDetail, CommentQueryType, GetCommentsResponse } from "../interfaces/comments.interfaces";

export const getComments = async (postId: string, query?: CommentQueryType): Promise<GetCommentsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.comments.by_post(postId), { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch comments. Please try again.");
    }
};

export const getComment = async (id: string): Promise<CommentDetail> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.comments.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch comment. Please try again.");
    }
};
