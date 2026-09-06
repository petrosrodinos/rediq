import { z } from 'zod';

export const ExportQuerySchema = z.object({
  format: z.enum(['json', 'markdown']).default('json'),
});

export type ExportQueryType = z.infer<typeof ExportQuerySchema>;
