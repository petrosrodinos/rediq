import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSavedSearch, deleteSavedSearch, getSavedSearches } from "../services/saved-searches.services";
import type { CreateSavedSearchDto, SavedSearchQueryType } from "../interfaces/saved-searches.interfaces";
import { toast } from "@/hooks/use-toast";

export const useGetSavedSearches = (query?: SavedSearchQueryType) => {
    return useQuery({
        queryKey: ["saved-searches", query],
        queryFn: () => getSavedSearches(query),
    });
};

export const useCreateSavedSearch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateSavedSearchDto) => createSavedSearch(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
            toast({
                title: "Search saved",
                description: "This search has been saved to your project.",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not save search",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteSavedSearch = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSavedSearch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-searches"] });
            toast({
                title: "Saved search removed",
                description: "The saved search has been deleted.",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not remove saved search",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
