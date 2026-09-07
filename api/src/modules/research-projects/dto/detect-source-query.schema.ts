import { z } from 'zod';

export const DetectSourceQuerySchema = z.object({
  url: z.string().min(1, 'A Reddit URL is required').url('Enter a valid URL'),
});

export type DetectSourceQueryType = z.infer<typeof DetectSourceQuerySchema>;
