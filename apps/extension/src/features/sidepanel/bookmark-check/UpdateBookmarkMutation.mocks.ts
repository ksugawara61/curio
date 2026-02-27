import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { UpdateBookmarkMutation } from "./UpdateBookmarkMutation";

export const UpdateBookmarkMutationMocks = {
  Loading: createMockMutation(UpdateBookmarkMutation, mockLoadingResolver),
  Success: createMockMutation(UpdateBookmarkMutation, async ({ request }) => {
    const body = (await request.json()) as {
      variables?: {
        id?: string;
        input?: {
          title?: string;
          url?: string;
          description?: string;
          note?: string;
          thumbnail?: string;
          tagNames?: string[];
        };
      };
    } | null;
    const { id, input } = body?.variables ?? {};
    return HttpResponse.json({
      data: {
        updateBookmark: {
          __typename: "Bookmark" as const,
          id: id ?? "updated-bookmark-id",
          title: input?.title ?? "Updated Bookmark",
          url: input?.url ?? "https://example.com",
          description: input?.description ?? null,
          note: input?.note ?? null,
          thumbnail: input?.thumbnail ?? null,
          archived_at: null,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: new Date().toISOString(),
          tags:
            input?.tagNames?.map((name, index) => ({
              id: `tag-${index}`,
              name,
            })) ?? [],
          relatedBookmarks: null,
        },
      },
    });
  }),
  Error: createMockMutation(UpdateBookmarkMutation, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to update bookmark",
        },
      ],
    });
  }),
};
