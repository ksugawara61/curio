import { z } from "zod";

export const bookmarkAddFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  note: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  tagInput: z.string().optional(),
});

export type BookmarkAddFormValues = z.infer<typeof bookmarkAddFormSchema>;
