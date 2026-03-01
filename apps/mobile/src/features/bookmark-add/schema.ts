import { z } from "zod";

export const bookmarkFormSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  description: z.string().optional(),
  note: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal("")),
  tagInput: z.string().optional(),
});

export type BookmarkFormValues = z.infer<typeof bookmarkFormSchema>;
