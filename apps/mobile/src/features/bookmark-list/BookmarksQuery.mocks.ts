import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { BookmarksQuery } from "./BookmarksQuery";

const mockBookmark = {
  __typename: "Bookmark" as const,
  id: "bookmark-1",
  title: "React Native 公式ドキュメント",
  description: "React Native の公式ドキュメントです。",
  url: "https://reactnative.dev",
  thumbnail: "https://example.com/thumbnail-1.jpg",
  note: null,
  tags: [
    { id: "tag-1", name: "React Native" },
    { id: "tag-2", name: "Mobile" },
  ],
  created_at: "2024-01-15T10:00:00Z",
  archived_at: null,
};

const mockBookmarkNoThumbnail = {
  __typename: "Bookmark" as const,
  id: "bookmark-2",
  title: "Expo Router ドキュメント",
  description: null,
  url: "https://expo.github.io/router",
  thumbnail: null,
  note: null,
  tags: [],
  created_at: "2024-01-20T10:00:00Z",
  archived_at: null,
};

export const BookmarksQueryMocks = {
  Loading: createMockQuery(BookmarksQuery, mockLoadingResolver),
  Success: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: {
        bookmarks: [mockBookmark, mockBookmarkNoThumbnail],
      },
    });
  }),
  Empty: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      data: {
        bookmarks: [],
      },
    });
  }),
  Error: createMockQuery(BookmarksQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "ブックマークの取得に失敗しました",
        },
      ],
    });
  }),
};
