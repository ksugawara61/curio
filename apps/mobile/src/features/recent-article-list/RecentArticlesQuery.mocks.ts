import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

const mockArticle = {
  __typename: "Article" as const,
  id: "article-1",
  title: "React Native Web で始めるクロスプラットフォーム開発",
  description:
    "React Native Web を使ってモバイルと Web を統一的に開発する方法を解説します。",
  url: "https://example.com/article-1",
  thumbnail_url: "https://example.com/thumbnail-1.jpg",
  pub_date: "2024-01-15T10:00:00Z",
  read_at: null,
};

const mockArticleNoThumbnail = {
  __typename: "Article" as const,
  id: "article-2",
  title: "Vitest で React Native をテストする",
  description: null,
  url: "https://example.com/article-2",
  thumbnail_url: null,
  pub_date: "2024-01-20T10:00:00Z",
  read_at: null,
};

export const RecentArticlesQueryMocks = {
  Loading: createMockQuery(RecentArticlesQuery, mockLoadingResolver),
  Success: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      data: {
        articles: [mockArticle, mockArticleNoThumbnail],
      },
    });
  }),
  Empty: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      data: {
        articles: [],
      },
    });
  }),
  Error: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "記事の取得に失敗しました",
        },
      ],
    });
  }),
};
