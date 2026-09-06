import { z } from 'zod';
import { AnalysisStatus } from 'generated/prisma';

export const ResearchProjectsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  search: z.string().optional(),
  status: z.nativeEnum(AnalysisStatus).optional(),
  order_by: z
    .enum(['created_at', 'updated_at', 'name'])
    .optional()
    .default('updated_at'),
  order_direction: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ResearchProjectsQueryType = z.infer<
  typeof ResearchProjectsQuerySchema
>;
