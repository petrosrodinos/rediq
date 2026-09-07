export const SemanticResultTypes = {
    POST: "post",
    COMMENT: "comment",
    KNOWLEDGE_CHUNK: "knowledge_chunk",
    KNOWLEDGE_INSIGHT: "knowledge_insight",
} as const;

export type SemanticResultType = (typeof SemanticResultTypes)[keyof typeof SemanticResultTypes];

export interface SearchDto {
    query: string;
    limit?: number;
    types?: SemanticResultType[];
}

export interface SemanticSearchResult {
    type: SemanticResultType;
    id: string;
    score: number;
    excerpt: string;
    source: unknown;
}
