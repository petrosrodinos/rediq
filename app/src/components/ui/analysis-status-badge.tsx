import type { FC } from "react";
import { cn } from "@/lib/utils";
import { AnalysisStatus, type AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { getAnalysisStatusLabel } from "@/config/constants/dropdowns/research-projects/analysis-status-form.options";

const toneClassMap: Record<AnalysisStatusType, string> = {
    [AnalysisStatus.PENDING]: "bg-muted text-muted-foreground border-border",
    [AnalysisStatus.COLLECTING_DATA]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.FILTERING]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.PROCESSING]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.GENERATING_EMBEDDINGS]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.EXTRACTING_KNOWLEDGE]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.AWAITING_BATCH_COMPLETION]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.SYNTHESIZING]: "bg-sea-soft text-sea border-sea/30",
    [AnalysisStatus.COMPLETED]: "bg-moss-soft text-moss border-moss/30",
    [AnalysisStatus.FAILED]: "bg-rose-soft text-rose border-rose/25",
};

interface AnalysisStatusBadgeProps {
    status: AnalysisStatusType;
    className?: string;
}

export const AnalysisStatusBadge: FC<AnalysisStatusBadgeProps> = ({ status, className }) => {
    return (
        <span className={cn("inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium", toneClassMap[status], className)}>
            {getAnalysisStatusLabel(status)}
        </span>
    );
};
