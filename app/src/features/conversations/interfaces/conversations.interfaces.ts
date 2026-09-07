import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export const ConversationModes = {
    GROUNDED: "GROUNDED",
    EXTERNAL_ALLOWED: "EXTERNAL_ALLOWED",
} as const;

export type ConversationMode = (typeof ConversationModes)[keyof typeof ConversationModes];

export const MessageRoles = {
    USER: "USER",
    ASSISTANT: "ASSISTANT",
    SYSTEM: "SYSTEM",
} as const;

export type MessageRole = (typeof MessageRoles)[keyof typeof MessageRoles];

export interface Conversation {
    id: string;
    research_project_uuid: string;
    user_uuid: string;
    title: string | null;
    mode: ConversationMode;
    created_at: string;
    updated_at: string;
}

export interface MessageCitation {
    id: string;
    conversation_message_uuid: string;
    post_uuid: string | null;
    comment_uuid: string | null;
    knowledge_insight_uuid: string | null;
    excerpt: string | null;
    created_at: string;
}

export interface ConversationMessage {
    id: string;
    conversation_uuid: string;
    role: MessageRole;
    content: string;
    created_at: string;
    citations?: MessageCitation[];
}

export interface ConversationWithMessages extends Conversation {
    messages: ConversationMessage[];
}

export interface CreateConversationDto {
    title?: string;
    mode?: ConversationMode;
}

export interface CreateMessageDto {
    content: string;
}

export interface ConversationQueryType {
    page?: number;
    limit?: number;
}

export interface ConversationsResponse {
    data: Conversation[];
    pagination: Pagination;
}
