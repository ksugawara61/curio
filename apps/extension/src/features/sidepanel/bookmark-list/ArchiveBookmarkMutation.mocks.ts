import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { ArchiveBookmarkMutation } from "./ArchiveBookmarkMutation";

export const ArchiveBookmarkMutationMocks = {
  Loading: createMockMutation(ArchiveBookmarkMutation, mockLoadingResolver),
  Success: createMockMutation(ArchiveBookmarkMutation, async ({ request }) => {
    const body = (await request.json()) as {
      variables?: { id?: string };
    } | null;
    const id = body?.variables?.id;
    return HttpResponse.json({
      data: {
        archiveBookmark: {
          __typename: "Bookmark" as const,
          id: id ?? "archived-bookmark-id",
          archived_at: new Date().toISOString(),
        },
      },
    });
  }),
  Error: createMockMutation(ArchiveBookmarkMutation, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to archive bookmark",
        },
      ],
    });
  }),
};
