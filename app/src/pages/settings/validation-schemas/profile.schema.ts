import { z } from "zod";

export const updateProfileSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    full_name: z.string().max(120).optional(),
    job_title: z.string().max(120).optional(),
    timezone: z.string().optional(),
    research_focus: z.string().max(2000).optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
