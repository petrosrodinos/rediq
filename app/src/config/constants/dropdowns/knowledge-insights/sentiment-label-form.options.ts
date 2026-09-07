import { SentimentLabel, type SentimentLabelType } from "@/features/knowledge-insights/interfaces/knowledge-insights.interfaces";

export const SentimentLabelFormOptions: { id: SentimentLabelType; label: string }[] = [
    { id: SentimentLabel.POSITIVE, label: "Positive" },
    { id: SentimentLabel.NEUTRAL, label: "Neutral" },
    { id: SentimentLabel.NEGATIVE, label: "Negative" },
];

export function getSentimentLabel(value: SentimentLabelType | string): string {
    return SentimentLabelFormOptions.find((option) => option.id === value)?.label ?? value;
}
