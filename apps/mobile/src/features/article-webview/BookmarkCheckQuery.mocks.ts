import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { BookmarkCheckQuery } from "./BookmarkCheckQuery";

export const BookmarkCheckQueryMocks = {
  Loading: createMockQuery(BookmarkCheckQuery, mockLoadingResolver),
  Bookmarked: createMockQuery(BookmarkCheckQuery, () => {
    return HttpResponse.json({
      data: {
        bookmark: {
          __typename: "Bookmark" as const,
          id: "bookmark-1",
          title: "Example Article",
          url: "https://example.com/article",
        },
      },
    });
  }),
  NotBookmarked: createMockQuery(BookmarkCheckQuery, () => {
    return HttpResponse.json({
      data: { bookmark: null },
    });
  }),
  Error: createMockQuery(BookmarkCheckQuery, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to fetch bookmark" }],
    });
  }),
};
