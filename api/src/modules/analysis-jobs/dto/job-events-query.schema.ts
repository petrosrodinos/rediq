import { z } from 'zod';
import { JobEventLevel } from 'generated/prisma';

export const JobEventsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 50)),
  level: z.nativeEnum(JobEventLevel).optional(),
  order_by: z.enum(['created_at']).optional().default('created_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type JobEventsQueryType = z.infer<typeof JobEventsQuerySchema>;
