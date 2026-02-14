import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { UnarchiveBookmarkMutation } from "./UnarchiveBookmarkMutation";

export const UnarchiveBookmarkMutationMocks = {
  Loading: createMockMutation(UnarchiveBookmarkMutation, mockLoadingResolver),
  Success: createMockMutation(
    UnarchiveBookmarkMutation,
    async ({ request }) => {
      const body = (await request.json()) as {
        variables?: { id?: string };
      } | null;
      const id = body?.variables?.id;
      return HttpResponse.json({
        data: {
          unarchiveBookmark: {
            __typename: "Bookmark" as const,
            id: id ?? "unarchived-bookmark-id",
            archived_at: null,
          },
        },
      });
    },
  ),
  Error: createMockMutation(UnarchiveBookmarkMutation, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to unarchive bookmark",
        },
      ],
    });
  }),
};
