import { z } from "zod";

export const bookmarkFormSchema = z.object({
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  tagInput: z.string().optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkFormSchema>;
