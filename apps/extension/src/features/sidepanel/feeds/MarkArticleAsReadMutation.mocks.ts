import { createMockMutation } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { MarkArticleAsReadMutation } from "./MarkArticleAsReadMutation";

export const MarkArticleAsReadMutationMocks = {
  Success: createMockMutation(
    MarkArticleAsReadMutation,
    async ({ request }) => {
      const body = (await request.json()) as {
        variables?: { id?: string };
      } | null;
      const id = body?.variables?.id ?? "article-1";
      return HttpResponse.json({
        data: {
          markArticleAsRead: {
            id,
            read_at: new Date().toISOString(),
          },
        },
      });
    },
  ),
};
