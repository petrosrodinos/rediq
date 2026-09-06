export interface ChunkForExtraction {
  knowledgeChunkId: string;
  content: string;
  postUuid: string | null;
  commentUuid: string | null;
}

export const INSIGHT_TYPES = [
  'KEY_INSIGHT',
  'PROBLEM',
  'SOLUTION',
  'OPINION',
  'CONSENSUS',
  'CONTRADICTION',
  'USER_EXPERIENCE',
  'PRODUCT_MENTION',
  'FAQ',
  'STATISTIC',
  'TREND',
  'RECOMMENDATION',
  'ARGUMENT',
] as const;
