import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";

export const CreateBookmarkMutationMocks = {
  Loading: createMockMutation(CreateBookmarkMutation, mockLoadingResolver),
  Success: createMockMutation(CreateBookmarkMutation, async ({ request }) => {
    const body = (await request.json()) as {
      variables?: { input?: { title?: string; url?: string } };
    } | null;
    const input = body?.variables?.input;
    return HttpResponse.json({
      data: {
        createBookmark: {
          __typename: "Bookmark" as const,
          id: "new-bookmark-id",
          title: input?.title ?? "New Bookmark",
          url: input?.url ?? "https://example.com",
        },
      },
    });
  }),
  Error: createMockMutation(CreateBookmarkMutation, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to create bookmark" }],
    });
  }),
};
