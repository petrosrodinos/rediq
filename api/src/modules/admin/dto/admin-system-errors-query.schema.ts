import { z } from 'zod';
import { JobEventLevel } from 'generated/prisma';

export const AdminSystemErrorsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20)),
  // Defaults to warnings + errors only — the noisy INFO stream belongs on the
  // per-job live log (GET /analysis-jobs/:id/events), not the admin alerts feed.
  level: z.nativeEnum(JobEventLevel).optional(),
});

export type AdminSystemErrorsQueryType = z.infer<
  typeof AdminSystemErrorsQuerySchema
>;
