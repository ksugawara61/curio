import { z } from "zod";

export const rssFeedFormSchema = z.object({
  url: z.string().min(1, "URL is required").url("Invalid URL format"),
});

export type RssFeedFormValues = z.infer<typeof rssFeedFormSchema>;
