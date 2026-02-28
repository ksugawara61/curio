import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { BookmarksQuery } from "./BookmarksQuery";

export const BookmarksQueryMocks = {
  Loading: createMockQuery(BookmarksQuery, mockLoadingResolver),
  Success: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: {
        bookmarks: [
          {
            __typename: "Bookmark" as const,
            id: "bookmark-1",
            title: "React Native 公式ドキュメント",
            url: "https://reactnative.dev",
          },
          {
            __typename: "Bookmark" as const,
            id: "bookmark-2",
            title: "Expo Router ドキュメント",
            url: "https://expo.github.io/router",
          },
        ],
      },
    });
  }),
  Empty: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: { bookmarks: [] },
    });
  }),
};
