import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDocument, getDocument, getDocuments, uploadDocument } from "../services/documents.services";
import type { DocumentQueryType } from "../interfaces/documents.interfaces";
import { toast } from "@/hooks/use-toast";

export const useGetDocuments = (query?: DocumentQueryType) => {
    return useQuery({
        queryKey: ["documents", query],
        queryFn: () => getDocuments(query),
    });
};

export const useGetDocument = (id: string) => {
    return useQuery({
        queryKey: ["documents", id],
        queryFn: () => getDocument(id),
        enabled: !!id,
    });
};

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadDocument,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Document uploaded",
                description: "Your document was uploaded successfully",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not upload document",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};

export const useDeleteDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteDocument(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            toast({
                title: "Document deleted",
                description: "The document was deleted successfully",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not delete document",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
