import { z } from 'zod';

export const PostQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  community: z.string().optional(),
  min_score: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined)),
  is_nsfw: z
    .string()
    .optional()
    .transform((v) =>
      v === undefined ? undefined : v === 'true' || v === '1',
    ),
  search: z.string().optional(),
  order_by: z
    .enum(['score', 'posted_at', 'num_comments', 'created_at'])
    .optional()
    .default('score'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type PostQueryType = z.infer<typeof PostQuerySchema>;
