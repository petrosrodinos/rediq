export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PostListResponse {
  data: any[];
  pagination: PaginationMeta;
}
