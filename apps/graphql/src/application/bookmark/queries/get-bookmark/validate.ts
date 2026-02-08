import { z } from "zod";

export const bookmarkQuerySchema = z
  .object({
    id: z.string().optional(),
    uri: z.string().optional(),
  })
  .refine((data) => data.id || data.uri, {
    message: "Either id or uri must be provided",
  });

export type BookmarkQueryInput = z.infer<typeof bookmarkQuerySchema>;
