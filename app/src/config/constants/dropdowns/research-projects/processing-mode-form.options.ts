import { ProcessingMode, type ProcessingModeType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

export const ProcessingModeFormOptions: { id: ProcessingModeType; label: string; description: string }[] = [
    {
        id: ProcessingMode.STANDARD,
        label: "Standard",
        description: "Results stream in as each stage finishes. Estimated 6 to 9 minutes.",
    },
    {
        id: ProcessingMode.BATCH,
        label: "Batch",
        description: "Half the cost, runs in the background. We'll email you when it's ready.",
    },
];

export function getProcessingModeLabel(mode: ProcessingModeType | string): string {
    return ProcessingModeFormOptions.find((option) => option.id === mode)?.label ?? mode;
}

export function getProcessingModeDescription(mode: ProcessingModeType | string): string {
    return ProcessingModeFormOptions.find((option) => option.id === mode)?.description ?? "";
}
