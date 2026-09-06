export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface KnowledgeChunkListResponse {
  data: any[];
  pagination: PaginationMeta;
}
