import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSavedInsight, deleteSavedInsight, getSavedInsights } from "../services/saved-insights.services";
import type { CreateSavedInsightDto, SavedInsightQueryType } from "../interfaces/saved-insights.interfaces";
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
