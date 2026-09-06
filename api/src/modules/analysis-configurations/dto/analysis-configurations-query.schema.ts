import { z } from 'zod';

export const AnalysisConfigurationsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  order_by: z.enum(['created_at']).optional().default('created_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type AnalysisConfigurationsQueryType = z.infer<
  typeof AnalysisConfigurationsQuerySchema
>;
