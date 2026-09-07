import { useQuery } from "@tanstack/react-query";
import { getKnowledgeChunks } from "../services/knowledge-chunks.services";
import type { KnowledgeChunkQueryType } from "../interfaces/knowledge-chunks.interfaces";

export const useGetKnowledgeChunks = (researchProjectId: string, query?: KnowledgeChunkQueryType) => {
    return useQuery({
        queryKey: ["knowledge-chunks", researchProjectId, query],
        queryFn: () => getKnowledgeChunks(researchProjectId, query),
        enabled: !!researchProjectId,
    });
};
