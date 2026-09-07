import { useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "../services/posts.services";
import type { PostQueryType } from "../interfaces/posts.interfaces";

export const useGetPosts = (researchProjectId: string, query?: PostQueryType) => {
    return useQuery({
        queryKey: ["posts", researchProjectId, query],
        queryFn: () => getPosts(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};

export const useGetPost = (id: string) => {
    return useQuery({
        queryKey: ["posts", id],
        queryFn: () => getPost(id),
        enabled: !!id,
    });
};
