import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    Conversation,
    ConversationQueryType,
    ConversationWithMessages,
    ConversationsResponse,
    CreateConversationDto,
    CreateMessageDto,
    ConversationMessage,
} from "../interfaces/conversations.interfaces";

export const createConversation = async (
    researchProjectId: string,
    dto: CreateConversationDto,
): Promise<Conversation> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.conversations.by_research_project(researchProjectId), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to create conversation. Please try again.");
    }
};

export const getConversations = async (
    researchProjectId: string,
    query?: ConversationQueryType,
): Promise<ConversationsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.conversations.by_research_project(researchProjectId), {
            params: query,
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch conversations. Please try again.");
    }
};

export const getConversation = async (id: string): Promise<ConversationWithMessages> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.conversations.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch conversation. Please try again.");
    }
};

export const deleteConversation = async (id: string): Promise<{ success: boolean }> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.conversations.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete conversation. Please try again.");
    }
};

export const sendConversationMessage = async (
    id: string,
    dto: CreateMessageDto,
): Promise<ConversationMessage> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.conversations.messages(id), dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to send message. Please try again.");
    }
};
