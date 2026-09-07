import { useQuery } from "@tanstack/react-query";
import { getComment, getComments } from "../services/comments.services";
import type { CommentQueryType } from "../interfaces/comments.interfaces";

export const useGetComments = (postId: string, query?: CommentQueryType) => {
    return useQuery({
        queryKey: ["comments", postId, query],
        queryFn: () => getComments(postId, query),
        enabled: !!postId,
    });
};

export const useGetComment = (id: string) => {
    return useQuery({
        queryKey: ["comments", id],
        queryFn: () => getComment(id),
        enabled: !!id,
    });
};
