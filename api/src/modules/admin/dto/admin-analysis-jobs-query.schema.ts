import { z } from 'zod';
import { AnalysisStatus, ProcessingMode } from 'generated/prisma';

export const AdminAnalysisJobsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20)),
  status: z.nativeEnum(AnalysisStatus).optional(),
  processing_mode: z.nativeEnum(ProcessingMode).optional(),
});

export type AdminAnalysisJobsQueryType = z.infer<
  typeof AdminAnalysisJobsQuerySchema
>;
