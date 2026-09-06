export interface SavedInsightListPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface SavedInsightListResponse {
  data: unknown[];
  pagination: SavedInsightListPagination;
}
