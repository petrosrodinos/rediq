import { z } from 'zod';

export const SavedSearchQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
  research_project_uuid: z.string().optional(),
});

export type SavedSearchQueryType = z.infer<typeof SavedSearchQuerySchema>;
