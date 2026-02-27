import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { ArchivedBookmarksQuery } from "./ArchivedBookmarksQuery";

const mockArchivedBookmarks = [
  {
    __typename: "Bookmark" as const,
    id: "archived-1",
    title: "Archived Article",
    url: "https://example.com/archived",
    description: "An archived bookmark",
    note: null,
    thumbnail: null,
    archived_at: "2024-02-01T00:00:00Z",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
    tags: [{ id: "1", name: "Archived" }],
    relatedBookmarks: null,
  },
];

export const ArchivedBookmarksQueryMocks = {
  Loading: createMockQuery(ArchivedBookmarksQuery, mockLoadingResolver),
  Success: createMockQuery(ArchivedBookmarksQuery, () => {
    return HttpResponse.json({
      data: { archivedBookmarks: mockArchivedBookmarks },
    });
  }),
  Empty: createMockQuery(ArchivedBookmarksQuery, () => {
    return HttpResponse.json({
      data: { archivedBookmarks: [] },
    });
  }),
  Error: createMockQuery(ArchivedBookmarksQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to fetch archived bookmarks",
        },
      ],
    });
  }),
};
