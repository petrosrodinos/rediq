import { z } from 'zod';

export const TopicQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  order_by: z.enum(['name', 'created_at']).optional().default('created_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type TopicQueryType = z.infer<typeof TopicQuerySchema>;
