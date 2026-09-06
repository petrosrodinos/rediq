export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface KnowledgeInsightListResponse {
  data: any[];
  pagination: PaginationMeta;
}
