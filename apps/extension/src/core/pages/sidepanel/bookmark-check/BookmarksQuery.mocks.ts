import { createMockQuery, mockLoadingResolver } from "@curio/graphql-client";
import { HttpResponse } from "msw";
import { BookmarksQuery } from "./BookmarksQuery";

const mockBookmarks = [
  {
    __typename: "Bookmark" as const,
    id: "1",
    title: "Example Bookmark",
    url: "https://example.com",
    description: "This is an example bookmark",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    tags: [
      { id: "1", name: "Tech" },
      { id: "2", name: "Tutorial" },
    ],
  },
  {
    __typename: "Bookmark" as const,
    id: "2",
    title: "Another Bookmark",
    url: "https://another-example.com",
    description: "Another example",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    tags: [{ id: "3", name: "Development" }],
  },
];

export const BookmarksQueryMocks = {
  Loading: createMockQuery(BookmarksQuery, mockLoadingResolver),
  Success: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: { bookmarks: mockBookmarks },
    });
  }),
  Empty: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: { bookmarks: [] },
    });
  }),
  WithMatchingUrl: (url: string) =>
    createMockQuery(BookmarksQuery, () => {
      return HttpResponse.json({
        data: {
          bookmarks: [
            {
              __typename: "Bookmark" as const,
              id: "matching-1",
              title: "Matching Bookmark",
              url: url,
              description: "This bookmark matches the current URL",
              created_at: "2024-01-01T00:00:00Z",
              updated_at: "2024-01-01T00:00:00Z",
              tags: [{ id: "1", name: "Matched" }],
            },
          ],
        },
      });
    }),
  Error: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to fetch bookmarks",
        },
      ],
    });
  }),
};
