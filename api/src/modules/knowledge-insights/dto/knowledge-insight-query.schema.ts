import { z } from 'zod';
import { InsightType, SentimentLabel } from 'generated/prisma';

export const KnowledgeInsightQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  type: z.nativeEnum(InsightType).optional(),
  sentiment: z.nativeEnum(SentimentLabel).optional(),
  topic_uuid: z.string().optional(),
  min_confidence: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  search: z.string().optional(),
  order_by: z
    .enum(['confidence_score', 'supporting_count', 'created_at'])
    .optional()
    .default('supporting_count'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type KnowledgeInsightQueryType = z.infer<
  typeof KnowledgeInsightQuerySchema
>;
