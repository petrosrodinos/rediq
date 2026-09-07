import { z } from "zod";

export const renameProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
});

export type RenameProjectFormData = z.infer<typeof renameProjectSchema>;
