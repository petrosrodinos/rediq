import { InsightType, type InsightTypeType, type KnowledgeInsight } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";

export const byType = (insights: KnowledgeInsight[], type: InsightTypeType): KnowledgeInsight[] => insights.filter((insight) => insight.type === type);

export const byTypes = (insights: KnowledgeInsight[], types: InsightTypeType[]): KnowledgeInsight[] => insights.filter((insight) => types.includes(insight.type));

export const KEY_INSIGHT_TYPES: InsightTypeType[] = [
    InsightType.KEY_INSIGHT,
    InsightType.RECOMMENDATION,
    InsightType.TREND,
    InsightType.ARGUMENT,
    InsightType.USER_EXPERIENCE,
];

export type ConfidenceLevel = "high" | "medium" | "low";

export const getConfidenceLevel = (score: number | null | undefined): ConfidenceLevel => {
    if (score === null || score === undefined) return "low";
    if (score >= 0.75) return "high";
    if (score >= 0.5) return "medium";
    return "low";
};

export type SeverityLevel = "high" | "medium";

export const getProblemSeverity = (insight: KnowledgeInsight): SeverityLevel => {
    const highConfidence = (insight.confidence_score ?? 0) >= 0.75;
    const widelyReported = insight.supporting_count >= 10;
    return highConfidence || widelyReported ? "high" : "medium";
};
