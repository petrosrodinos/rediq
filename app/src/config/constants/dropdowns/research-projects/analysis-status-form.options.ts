import { AnalysisStatus, type AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";

export const AnalysisStatusFormOptions: { id: AnalysisStatusType; label: string }[] = [
    { id: AnalysisStatus.PENDING, label: "Pending" },
    { id: AnalysisStatus.COLLECTING_DATA, label: "Collecting data" },
    { id: AnalysisStatus.FILTERING, label: "Filtering" },
    { id: AnalysisStatus.PROCESSING, label: "Processing" },
    { id: AnalysisStatus.GENERATING_EMBEDDINGS, label: "Generating embeddings" },
    { id: AnalysisStatus.EXTRACTING_KNOWLEDGE, label: "Extracting knowledge" },
    { id: AnalysisStatus.AWAITING_BATCH_COMPLETION, label: "Awaiting batch completion" },
    { id: AnalysisStatus.SYNTHESIZING, label: "Synthesizing" },
    { id: AnalysisStatus.COMPLETED, label: "Ready" },
    { id: AnalysisStatus.FAILED, label: "Needs attention" },
];

export function getAnalysisStatusLabel(status: AnalysisStatusType | string): string {
    return AnalysisStatusFormOptions.find((option) => option.id === status)?.label ?? status;
}

/** True while the pipeline is actively running (anything between PENDING and COMPLETED/FAILED). */
export const RUNNING_ANALYSIS_STATUSES: AnalysisStatusType[] = [
    AnalysisStatus.PENDING,
    AnalysisStatus.COLLECTING_DATA,
    AnalysisStatus.FILTERING,
    AnalysisStatus.PROCESSING,
    AnalysisStatus.GENERATING_EMBEDDINGS,
    AnalysisStatus.EXTRACTING_KNOWLEDGE,
    AnalysisStatus.AWAITING_BATCH_COMPLETION,
    AnalysisStatus.SYNTHESIZING,
];
