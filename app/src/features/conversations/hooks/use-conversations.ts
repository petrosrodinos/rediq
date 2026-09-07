import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    createConversation,
    deleteConversation,
    getConversation,
    getConversations,
    sendConversationMessage,
} from "../services/conversations.services";
import type { ConversationQueryType, CreateConversationDto, CreateMessageDto } from "../interfaces/conversations.interfaces";

export const useGetConversations = (researchProjectId: string, query?: ConversationQueryType) => {
    return useQuery({
        queryKey: ["conversations", researchProjectId, query],
        queryFn: () => getConversations(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};

export const useGetConversation = (id: string) => {
    return useQuery({
        queryKey: ["conversations", id],
        queryFn: () => getConversation(id),
        enabled: !!id,
    });
};

export const useCreateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ researchProjectId, dto }: { researchProjectId: string; dto: CreateConversationDto }) =>
            createConversation(researchProjectId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast({
                title: "Conversation created",
                description: "Your conversation has been started",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not create conversation",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteConversation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            toast({
                title: "Conversation deleted",
                description: "The conversation has been deleted",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not delete conversation",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useSendConversationMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: CreateMessageDto }) => sendConversationMessage(id, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["conversations", variables.id] });
            toast({
                title: "Message sent",
                description: "Your message has been sent",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not send message",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
