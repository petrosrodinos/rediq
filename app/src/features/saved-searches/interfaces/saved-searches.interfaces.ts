import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export const TopTimeRange = {
    HOUR: "HOUR",
    DAY: "DAY",
    WEEK: "WEEK",
    MONTH: "MONTH",
    YEAR: "YEAR",
    ALL: "ALL",
} as const;
export type TopTimeRangeType = (typeof TopTimeRange)[keyof typeof TopTimeRange];

export interface SavedSearch {
    id: string;
    user_uuid: string;
    research_project_uuid: string | null;
    name: string | null;
    query: string;
    min_score: number | null;
    time_range: TopTimeRangeType | null;
    created_at: string;
}

export interface CreateSavedSearchDto {
    query: string;
    research_project_uuid?: string | null;
    name?: string | null;
    min_score?: number | null;
    time_range?: TopTimeRangeType | null;
}

export interface SavedSearchQueryType {
    page?: number;
    limit?: number;
    research_project_uuid?: string;
}

export interface GetSavedSearchesResponse {
    data: SavedSearch[];
    pagination: Pagination;
}

export interface DeleteSavedSearchResponse {
    success: boolean;
}
