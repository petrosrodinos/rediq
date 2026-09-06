import { z } from 'zod';

export const DocumentsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  type: z.string().optional(),
  order_by: z.enum(['created_at', 'filename']).optional().default('created_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type DocumentsQueryType = z.infer<typeof DocumentsQuerySchema>;
