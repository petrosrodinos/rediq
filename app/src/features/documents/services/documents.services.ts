import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type {
    Document,
    DocumentQueryType,
    GetDocumentsResponse,
    UploadDocumentPayload,
} from "../interfaces/documents.interfaces";

export const uploadDocument = async (payload: UploadDocumentPayload): Promise<Document> => {
    try {
        const { file, ...fields } = payload;

        const formData = new FormData();
        formData.append("file", file);

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value as string);
            }
        });

        const response = await axiosInstance.post(ApiRoutes.documents.prefix, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        throw new Error("Failed to upload document. Please try again.");
    }
};

export const getDocuments = async (query?: DocumentQueryType): Promise<GetDocumentsResponse> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.documents.prefix, { params: query });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch documents. Please try again.");
    }
};

export const getDocument = async (id: string): Promise<Document> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.documents.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch document. Please try again.");
    }
};

export const deleteDocument = async (id: string): Promise<Document> => {
    try {
        const response = await axiosInstance.delete(ApiRoutes.documents.by_id(id));
        return response.data;
    } catch (error) {
        throw new Error("Failed to delete document. Please try again.");
    }
};
