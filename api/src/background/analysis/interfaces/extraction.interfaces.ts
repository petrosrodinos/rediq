import { InsightType } from 'generated/prisma';

export interface ChunkForExtraction {
  knowledgeChunkId: string;
  content: string;
  postUuid: string | null;
  commentUuid: string | null;
}

export const INSIGHT_TYPES = Object.values(InsightType) as [
  InsightType,
  ...InsightType[],
];
