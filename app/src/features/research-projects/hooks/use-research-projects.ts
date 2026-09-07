import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
    createResearchProject,
    deleteResearchProject,
    detectResearchSource,
    getResearchProject,
    getResearchProjects,
    recalculateResearchProjectSentiment,
    updateResearchProject,
} from "../services/research-projects.services";
import type {
    CreateResearchProjectDto,
    ResearchProjectQueryType,
    UpdateResearchProjectDto,
} from "../interfaces/research-projects.interfaces";

export const useGetResearchProjects = (query?: ResearchProjectQueryType) => {
    return useQuery({
        queryKey: ["research-projects", query],
        queryFn: () => getResearchProjects(query),
    });
};

export const useGetResearchProject = (id: string) => {
    return useQuery({
        queryKey: ["research-projects", id],
        queryFn: () => getResearchProject(id),
        enabled: !!id,
    });
};

export const useCreateResearchProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateResearchProjectDto) => createResearchProject(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["research-projects"] });
            toast({
                title: "Research project created",
                description: "The research project was created successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not create research project",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useUpdateResearchProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateResearchProjectDto }) => updateResearchProject(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["research-projects"] });
            toast({
                title: "Research project updated",
                description: "The research project was updated successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not update research project",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

// Search-as-you-act, triggered by the "Detect source" button rather than
// auto-fetched, so it's modeled as a mutation. No success toast (the detected
// result renders inline) but errors still surface feedback per the rules.
export const useDetectResearchSource = () => {
    return useMutation({
        mutationFn: (url: string) => detectResearchSource(url),
        onError: (error: Error) => {
            toast({
                title: "Could not detect source",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useRecalculateResearchProjectSentiment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => recalculateResearchProjectSentiment(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: ["research-projects", id] });
            queryClient.invalidateQueries({ queryKey: ["research-projects"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not recalculate sentiment",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteResearchProject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteResearchProject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["research-projects"] });
            toast({
                title: "Research project deleted",
                description: "The research project was deleted successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not delete research project",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};
