import { useQuery } from "@tanstack/react-query";
import { getTopic, getTopics } from "../services/topics.services";
import type { TopicQueryType } from "../interfaces/topics.interfaces";

export const useGetTopics = (researchProjectId: string, query?: TopicQueryType) => {
    return useQuery({
        queryKey: ["topics", researchProjectId, query],
        queryFn: () => getTopics(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};

export const useGetTopic = (id: string) => {
    return useQuery({
        queryKey: ["topics", id],
        queryFn: () => getTopic(id),
        enabled: !!id,
    });
};
