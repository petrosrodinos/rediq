import { TopTimeRange, type TopTimeRangeType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

export const TopTimeRangeFormOptions: { id: TopTimeRangeType; label: string }[] = [
    { id: TopTimeRange.HOUR, label: "Hour" },
    { id: TopTimeRange.DAY, label: "Day" },
    { id: TopTimeRange.WEEK, label: "Week" },
    { id: TopTimeRange.MONTH, label: "Month" },
    { id: TopTimeRange.YEAR, label: "Year" },
    { id: TopTimeRange.ALL, label: "All time" },
];

export function getTopTimeRangeLabel(value: TopTimeRangeType | string): string {
    return TopTimeRangeFormOptions.find((option) => option.id === value)?.label ?? value;
}
