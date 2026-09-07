import type { Pagination } from "@/interfaces/pagination/pagination.interface";

export const DocumentTypes = {
    LOGO: "LOGO",
    BANNER: "BANNER",
    IMAGE: "IMAGE",
    VIDEO: "VIDEO",
    AUDIO: "AUDIO",
    PDF: "PDF",
    DOCUMENT: "DOCUMENT",
    OTHER: "OTHER",
} as const;

export type DocumentType = (typeof DocumentTypes)[keyof typeof DocumentTypes];

export interface Document {
    id: string;
    user_uuid: string;
    filename: string;
    mimetype: string;
    size: number;
    url: string;
    path: string;
    type: DocumentType;
    created_at: string;
}

export interface CreateDocumentDto {
    type?: DocumentType;
}

export type UploadDocumentPayload = { file: File } & CreateDocumentDto;

export const DocumentOrderByFields = {
    CREATED_AT: "created_at",
    FILENAME: "filename",
} as const;

export type DocumentOrderByField = (typeof DocumentOrderByFields)[keyof typeof DocumentOrderByFields];

export const DocumentOrderDirections = {
    ASC: "asc",
    DESC: "desc",
} as const;

export type DocumentOrderDirection = (typeof DocumentOrderDirections)[keyof typeof DocumentOrderDirections];

export interface DocumentQueryType {
    page?: number;
    limit?: number;
    type?: DocumentType;
    order_by?: DocumentOrderByField;
    order_direction?: DocumentOrderDirection;
}

export interface GetDocumentsResponse {
    data: Document[];
    pagination: Pagination;
}
