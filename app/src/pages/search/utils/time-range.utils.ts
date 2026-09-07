import { TopTimeRange, type TopTimeRangeType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";

const RANGE_MS: Partial<Record<TopTimeRangeType, number>> = {
    [TopTimeRange.DAY]: 24 * 60 * 60 * 1000,
    [TopTimeRange.WEEK]: 7 * 24 * 60 * 60 * 1000,
    [TopTimeRange.MONTH]: 3 * 30 * 24 * 60 * 60 * 1000, // used for the search page's "3mo" filter
    [TopTimeRange.YEAR]: 365 * 24 * 60 * 60 * 1000,
};

export const getTimeRangeCutoff = (range: TopTimeRangeType | null): Date | null => {
    if (!range || !RANGE_MS[range]) return null;
    return new Date(Date.now() - RANGE_MS[range]!);
};
