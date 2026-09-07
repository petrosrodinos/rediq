import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { AnalysisStatus, type AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";
import {
    cancelAnalysisJob,
    createAnalysisJob,
    getAnalysisJob,
    getAnalysisJobBatchSubmissions,
    getAnalysisJobEvents,
    getAnalysisJobs,
} from "../services/analysis-jobs.services";
import type {
    AnalysisJob,
    AnalysisJobQueryType,
    BatchSubmissionQueryType,
    CreateAnalysisJobDto,
    JobEventQueryType,
} from "../interfaces/analysis-jobs.interfaces";

const TERMINAL_ANALYSIS_STATUSES: AnalysisStatusType[] = [AnalysisStatus.COMPLETED, AnalysisStatus.FAILED];

const JOB_POLL_INTERVAL_MS = 5000;

export const useGetAnalysisJobs = (researchProjectId: string, query?: AnalysisJobQueryType) => {
    return useQuery({
        queryKey: ["analysis-jobs", researchProjectId, query],
        queryFn: () => getAnalysisJobs(researchProjectId, query),
        enabled: !!researchProjectId,
        refetchInterval: (currentQuery) => {
            const jobs = currentQuery.state.data?.data ?? [];
            const hasActiveJob = jobs.some((job) => !TERMINAL_ANALYSIS_STATUSES.includes(job.status));
            return hasActiveJob ? JOB_POLL_INTERVAL_MS : false;
        },
    });
};

export const useGetAnalysisJob = (id: string) => {
    return useQuery({
        queryKey: ["analysis-jobs", id],
        queryFn: () => getAnalysisJob(id),
        enabled: !!id,
        refetchInterval: (currentQuery) => {
            const status = currentQuery.state.data?.status;
            if (!status) return false;
            return TERMINAL_ANALYSIS_STATUSES.includes(status) ? false : JOB_POLL_INTERVAL_MS;
        },
    });
};

export const useCreateAnalysisJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ researchProjectId, dto }: { researchProjectId: string; dto: CreateAnalysisJobDto }) =>
            createAnalysisJob(researchProjectId, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["analysis-jobs"] });
            toast({
                title: "Analysis job started",
                description: "The analysis job was created and queued successfully.",
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not start analysis job",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useCancelAnalysisJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cancelAnalysisJob(id),
        onSuccess: (data: AnalysisJob) => {
            queryClient.invalidateQueries({ queryKey: ["analysis-jobs"] });
            toast({
                title: "Analysis job cancelled",
                description: `The analysis job (${data.id}) was cancelled successfully.`,
                duration: 2000,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Could not cancel analysis job",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useGetAnalysisJobBatchSubmissions = (id: string, query?: BatchSubmissionQueryType) => {
    return useQuery({
        queryKey: ["analysis-jobs", id, "batch-submissions", query],
        queryFn: () => getAnalysisJobBatchSubmissions(id, query),
        enabled: !!id,
    });
};

export const useGetAnalysisJobEvents = (id: string, query?: JobEventQueryType, options?: { jobStatus?: AnalysisStatusType }) => {
    return useQuery({
        queryKey: ["analysis-jobs", id, "events", query],
        queryFn: () => getAnalysisJobEvents(id, query),
        enabled: !!id,
        refetchInterval: options?.jobStatus && !TERMINAL_ANALYSIS_STATUSES.includes(options.jobStatus) ? JOB_POLL_INTERVAL_MS : false,
    });
};
