export interface ConversationListPagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ConversationListResponse {
  data: unknown[];
  pagination: ConversationListPagination;
}
