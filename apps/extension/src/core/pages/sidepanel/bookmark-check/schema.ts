import { z } from "zod";

export const bookmarkFormSchema = z.object({
  description: z.string().optional(),
  tagInput: z.string().optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkFormSchema>;
