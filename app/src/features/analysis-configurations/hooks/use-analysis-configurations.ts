import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    createAnalysisConfiguration,
    deleteAnalysisConfiguration,
    getAnalysisConfiguration,
    getAnalysisConfigurations,
    updateAnalysisConfiguration,
} from "../services/analysis-configurations.services";
import type {
    AnalysisConfigurationQueryType,
    CreateAnalysisConfigurationDto,
    UpdateAnalysisConfigurationDto,
} from "../interfaces/analysis-configurations.interfaces";

export const useGetAnalysisConfigurations = (
    researchProjectId: string,
    query?: AnalysisConfigurationQueryType,
) => {
    return useQuery({
        queryKey: ["analysis-configurations", researchProjectId, query],
        queryFn: () => getAnalysisConfigurations(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};

export const useGetAnalysisConfiguration = (id: string) => {
    return useQuery({
        queryKey: ["analysis-configurations", id],
        queryFn: () => getAnalysisConfiguration(id),
        enabled: !!id,
    });
};

export const useCreateAnalysisConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            researchProjectId,
            dto,
        }: {
            researchProjectId: string;
            dto: CreateAnalysisConfigurationDto;
        }) => createAnalysisConfiguration(researchProjectId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-configurations"] });
            toast({
                title: "Analysis configuration created",
                description: "The analysis configuration was created successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not create analysis configuration",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useUpdateAnalysisConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateAnalysisConfigurationDto }) =>
            updateAnalysisConfiguration(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-configurations"] });
            toast({
                title: "Analysis configuration updated",
                description: "The analysis configuration was updated successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update analysis configuration",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteAnalysisConfiguration = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAnalysisConfiguration(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-configurations"] });
            toast({
                title: "Analysis configuration deleted",
                description: "The analysis configuration was deleted successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not delete analysis configuration",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};
