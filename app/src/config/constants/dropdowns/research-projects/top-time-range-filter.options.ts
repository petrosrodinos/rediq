import type { TopTimeRangeType } from "@/features/analysis-configurations/interfaces/analysis-configurations.interfaces";
import { TopTimeRangeFormOptions } from "./top-time-range-form.options";

export const TopTimeRangeFilterOptions: { id: TopTimeRangeType | "all"; label: string }[] = [
    { id: "all", label: "Any time" },
    ...TopTimeRangeFormOptions,
];
