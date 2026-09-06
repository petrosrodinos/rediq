import { z } from 'zod';

export const CommentQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  min_score: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
  order_by: z.enum(['score', 'posted_at', 'depth']).optional().default('score'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CommentQueryType = z.infer<typeof CommentQuerySchema>;
