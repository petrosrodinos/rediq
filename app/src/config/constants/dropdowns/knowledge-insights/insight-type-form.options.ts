import { InsightType, type InsightTypeType } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";

export const InsightTypeFormOptions: { id: InsightTypeType; label: string }[] = [
    { id: InsightType.KEY_INSIGHT, label: "Key insight" },
    { id: InsightType.PROBLEM, label: "Problem" },
    { id: InsightType.SOLUTION, label: "Solution" },
    { id: InsightType.OPINION, label: "Opinion" },
    { id: InsightType.CONSENSUS, label: "Consensus" },
    { id: InsightType.CONTRADICTION, label: "Contradiction" },
    { id: InsightType.USER_EXPERIENCE, label: "User experience" },
    { id: InsightType.PRODUCT_MENTION, label: "Product mention" },
    { id: InsightType.FAQ, label: "FAQ" },
    { id: InsightType.STATISTIC, label: "Statistic" },
    { id: InsightType.TREND, label: "Trend" },
    { id: InsightType.RECOMMENDATION, label: "Recommendation" },
    { id: InsightType.ARGUMENT, label: "Argument" },
];

export function getInsightTypeLabel(type: InsightTypeType | string): string {
    return InsightTypeFormOptions.find((option) => option.id === type)?.label ?? type;
}
