import { DocumentType } from 'generated/prisma';

export interface DocumentRecord {
  id: string;
  user_uuid: string;
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  type: DocumentType;
  created_at: Date;
}

export interface DocumentListResponse {
  data: DocumentRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}
