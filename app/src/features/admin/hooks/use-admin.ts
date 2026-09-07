import { useQuery } from "@tanstack/react-query";
import {
    getAdminAnalysisJobs,
    getAdminQueueStatus,
    getAdminResearchProjects,
    getAdminStats,
    getAdminSystemErrors,
    getAdminUser,
    getAdminUsers,
} from "../services/admin.services";
import type {
    AdminAnalysisJobQueryType,
    AdminResearchProjectQueryType,
    AdminSystemErrorQueryType,
    AdminUserQueryType,
} from "../interfaces/admin.interfaces";

export const useGetAdminStats = () => {
    return useQuery({
        queryKey: ["admin", "stats"],
        queryFn: () => getAdminStats(),
    });
};

export const useGetAdminUsers = (query?: AdminUserQueryType) => {
    return useQuery({
        queryKey: ["admin", "users", query],
        queryFn: () => getAdminUsers(query),
    });
};

export const useGetAdminUser = (id: string) => {
    return useQuery({
        queryKey: ["admin", "users", id],
        queryFn: () => getAdminUser(id),
        enabled: !!id,
    });
};

export const useGetAdminResearchProjects = (query?: AdminResearchProjectQueryType) => {
    return useQuery({
        queryKey: ["admin", "research-projects", query],
        queryFn: () => getAdminResearchProjects(query),
    });
};

export const useGetAdminAnalysisJobs = (query?: AdminAnalysisJobQueryType) => {
    return useQuery({
        queryKey: ["admin", "analysis-jobs", query],
        queryFn: () => getAdminAnalysisJobs(query),
    });
};

export const useGetAdminSystemErrors = (query?: AdminSystemErrorQueryType) => {
    return useQuery({
        queryKey: ["admin", "system-errors", query],
        queryFn: () => getAdminSystemErrors(query),
        refetchInterval: 30000,
    });
};

export const useGetAdminQueueStatus = () => {
    return useQuery({
        queryKey: ["admin", "queue"],
        queryFn: () => getAdminQueueStatus(),
        refetchInterval: 10000,
    });
};
