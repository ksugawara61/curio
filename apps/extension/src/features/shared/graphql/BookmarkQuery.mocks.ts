import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { BookmarkQuery } from "./BookmarkQuery";

const mockBookmark = {
  __typename: "Bookmark" as const,
  id: "1",
  title: "Example Bookmark",
  url: "https://example.com",
  description: "This is an example bookmark",
  note: "# Example Note\n\nThis is a **markdown** note.",
  thumbnail: "https://example.com/image.jpg",
  archived_at: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
  tags: [
    { id: "1", name: "Tech" },
    { id: "2", name: "Tutorial" },
  ],
  relatedBookmarks: null,
};

export const BookmarkQueryMocks = {
  Loading: createMockQuery(BookmarkQuery, mockLoadingResolver),
  Success: createMockQuery(BookmarkQuery, () => {
    return HttpResponse.json({
      data: { bookmark: mockBookmark },
    });
  }),
  NotFound: createMockQuery(BookmarkQuery, () => {
    return HttpResponse.json({
      data: { bookmark: null },
    });
  }),
  WithMatchingUrl: (url: string) =>
    createMockQuery(BookmarkQuery, () => {
      return HttpResponse.json({
        data: {
          bookmark: {
            __typename: "Bookmark" as const,
            id: "matching-1",
            title: "Matching Bookmark",
            url: url,
            description: "This bookmark matches the current URL",
            note: null,
            thumbnail: "https://example.com/matched-image.jpg",
            archived_at: null,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            tags: [{ id: "1", name: "Matched" }],
          relatedBookmarks: null,
          },
        },
      });
    }),
  Error: createMockQuery(BookmarkQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to fetch bookmark",
        },
      ],
    });
  }),
};
