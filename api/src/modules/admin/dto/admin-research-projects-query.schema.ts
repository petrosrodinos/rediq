import { z } from 'zod';
import { AnalysisStatus } from 'generated/prisma';

export const AdminResearchProjectsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20)),
  status: z.nativeEnum(AnalysisStatus).optional(),
  search: z.string().optional(),
});

export type AdminResearchProjectsQueryType = z.infer<
  typeof AdminResearchProjectsQuerySchema
>;
