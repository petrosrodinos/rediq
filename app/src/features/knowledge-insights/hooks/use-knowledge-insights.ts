import { useQuery } from "@tanstack/react-query";
import { getKnowledgeInsight, getKnowledgeInsights } from "../services/knowledge-insights.services";
import type { KnowledgeInsightQueryType } from "../interfaces/knowledge-insights.interfaces";

export const useGetKnowledgeInsights = (researchProjectId: string, query?: KnowledgeInsightQueryType) => {
    return useQuery({
        queryKey: ["knowledge-insights", researchProjectId, query],
        queryFn: () => getKnowledgeInsights(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};

export const useGetKnowledgeInsight = (id: string) => {
    return useQuery({
        queryKey: ["knowledge-insights", id],
        queryFn: () => getKnowledgeInsight(id),
        enabled: !!id,
    });
};
