import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { BookmarksQuery } from "./BookmarksQuery";

const mockBookmarks = [
  {
    __typename: "Bookmark" as const,
    id: "1",
    title: "React Documentation",
    url: "https://react.dev",
    description: "Official React documentation",
    note: "## Key Features\n\n- **Hooks**: Use state and other React features\n- **Components**: Build encapsulated components",
    thumbnail: "https://react.dev/images/og-home.png",
    archived_at: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    tags: [
      { id: "1", name: "React" },
      { id: "2", name: "Documentation" },
    ],
  },
  {
    __typename: "Bookmark" as const,
    id: "2",
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/",
    description: "Learn TypeScript from the official handbook",
    note: null,
    thumbnail:
      "https://www.typescriptlang.org/images/branding/ts-lettermark-blue.png",
    archived_at: null,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    tags: [
      { id: "3", name: "TypeScript" },
      { id: "4", name: "Tutorial" },
    ],
  },
  {
    __typename: "Bookmark" as const,
    id: "3",
    title: "GitHub",
    url: "https://github.com",
    description: null,
    note: null,
    thumbnail: null,
    archived_at: null,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    tags: [],
  },
];

export const BookmarksListQueryMocks = {
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
  SingleBookmark: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: {
        bookmarks: [mockBookmarks[0]],
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
