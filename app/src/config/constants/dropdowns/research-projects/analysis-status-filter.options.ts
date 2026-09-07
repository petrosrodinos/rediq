import type { AnalysisStatusType } from "@/features/research-projects/interfaces/research-projects.interfaces";
import { AnalysisStatusFormOptions } from "./analysis-status-form.options";

export const AnalysisStatusFilterOptions: { id: AnalysisStatusType | "all"; label: string }[] = [
    { id: "all", label: "All statuses" },
    ...AnalysisStatusFormOptions,
];
