import { z } from 'zod';

export const SavedInsightQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  research_project_uuid: z.string().optional(),
  collection_uuid: z.string().optional(),
});

export type SavedInsightQueryType = z.infer<typeof SavedInsightQuerySchema>;
