import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createSavedInsight,
    createSavedInsightCollection,
    deleteSavedInsight,
    deleteSavedInsightCollection,
    getSavedInsightCollections,
    getSavedInsights,
    updateSavedInsight,
    updateSavedInsightCollection,
} from "../services/saved-insights.services";
import type {
    CreateSavedInsightCollectionDto,
    CreateSavedInsightDto,
    SavedInsightQueryType,
    UpdateSavedInsightCollectionDto,
    UpdateSavedInsightDto,
} from "../interfaces/saved-insights.interfaces";
import { toast } from "@/hooks/use-toast";

export const useGetSavedInsights = (query?: SavedInsightQueryType) => {
    return useQuery({
        queryKey: ["saved-insights", query],
        queryFn: () => getSavedInsights(query),
    });
};

export const useCreateSavedInsight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateSavedInsightDto) => createSavedInsight(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insights"] });
            toast({
                title: "Insight saved",
                description: "The insight has been saved for later reference.",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not save insight",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteSavedInsight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSavedInsight(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insights"] });
            toast({
                title: "Insight unsaved",
                description: "The insight has been removed from your saved list.",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not unsave insight",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useUpdateSavedInsight = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateSavedInsightDto }) => updateSavedInsight(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insights"] });
            toast({
                title: "Insight moved",
                description: "The insight's collection has been updated.",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not move insight",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useGetSavedInsightCollections = () => {
    return useQuery({
        queryKey: ["saved-insight-collections"],
        queryFn: () => getSavedInsightCollections(),
    });
};

export const useCreateSavedInsightCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateSavedInsightCollectionDto) => createSavedInsightCollection(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insight-collections"] });
            toast({
                title: "Collection created",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not create collection",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useUpdateSavedInsightCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateSavedInsightCollectionDto }) =>
            updateSavedInsightCollection(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insight-collections"] });
            toast({
                title: "Collection renamed",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not rename collection",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteSavedInsightCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSavedInsightCollection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-insight-collections"] });
            queryClient.invalidateQueries({ queryKey: ["saved-insights"] });
            toast({
                title: "Collection deleted",
                description: "Insights inside it were kept, just uncategorized.",
                duration: 2500,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not delete collection",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
