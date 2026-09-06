import { z } from 'zod';

export const ConversationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10)),
});

export type ConversationQueryType = z.infer<typeof ConversationQuerySchema>;
