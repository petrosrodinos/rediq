import { AnalysisStatus, type AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";

export interface PipelineStepDefinition {
    key: string;
    label: string;
    statuses: AnalysisStatusType[];
}

export const PIPELINE_STEPS: PipelineStepDefinition[] = [
    { key: "collect", label: "Fetch posts & comments", statuses: [AnalysisStatus.PENDING, AnalysisStatus.COLLECTING_DATA, AnalysisStatus.FILTERING] },
    { key: "embed", label: "Generate embeddings", statuses: [AnalysisStatus.GENERATING_EMBEDDINGS] },
    {
        key: "extract",
        label: "Extract themes & claims",
        statuses: [AnalysisStatus.PROCESSING, AnalysisStatus.EXTRACTING_KNOWLEDGE, AnalysisStatus.AWAITING_BATCH_COMPLETION],
    },
    { key: "synthesize", label: "Synthesize report", statuses: [AnalysisStatus.SYNTHESIZING] },
    { key: "ready", label: "Build report & search index", statuses: [AnalysisStatus.COMPLETED] },
];

export type PipelineStepState = "done" | "active" | "pending" | "failed";

export interface PipelineProgressSignal {
    status: AnalysisStatusType;
    posts_processed: number;
    comments_processed: number;
    prompt_tokens: number;
    completion_tokens: number;
}

/**
 * A job that FAILED doesn't retain the status it was in right before failing,
 * so we infer the likely step from its progress counters instead of assuming
 * the last step died (a job can fail immediately during collection, e.g. a
 * Reddit 403, long before it ever reaches embeddings/extraction/synthesis).
 */
const guessFailedStepIndex = (job: PipelineProgressSignal): number => {
    if (job.prompt_tokens > 0 || job.completion_tokens > 0) return 2;
    if (job.comments_processed > 0) return 1;
    if (job.posts_processed > 0) return 1;
    return 0;
};

export const getPipelineStepStates = (job: PipelineProgressSignal): PipelineStepState[] => {
    if (job.status === AnalysisStatus.FAILED) {
        const failedIndex = guessFailedStepIndex(job);
        return PIPELINE_STEPS.map((_, index) => (index < failedIndex ? "done" : index === failedIndex ? "failed" : "pending"));
    }

    const activeIndex = PIPELINE_STEPS.findIndex((step) => step.statuses.includes(job.status));

    return PIPELINE_STEPS.map((_, index) => {
        if (activeIndex === -1) return "pending";
        if (index < activeIndex) return "done";
        if (index === activeIndex) return job.status === AnalysisStatus.COMPLETED ? "done" : "active";
        return "pending";
    });
};
