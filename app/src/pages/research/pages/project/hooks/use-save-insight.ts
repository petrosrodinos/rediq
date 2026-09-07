import { useState } from "react";
import { useCreateSavedInsight } from "@/features/saved-insights/hooks/use-saved-insights";

export const useSaveInsight = (researchProjectId: string) => {
    const [savingId, setSavingId] = useState<string | null>(null);
    const createSavedInsight = useCreateSavedInsight();

    const save = (knowledgeInsightId: string) => {
        setSavingId(knowledgeInsightId);
        createSavedInsight.mutate(
            { research_project_uuid: researchProjectId, knowledge_insight_uuid: knowledgeInsightId },
            { onSettled: () => setSavingId(null) },
        );
    };

    return { save, savingId };
};
