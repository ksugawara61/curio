import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

const mockRecentArticles = [
  {
    __typename: "Article" as const,
    id: "article-1",
    title: "Getting Started with React",
    url: "https://example.com/react-intro",
    description: "A beginner's guide to React development",
    pub_date: "Mon, 01 Jan 2024 00:00:00 GMT",
    thumbnail_url: "https://example.com/react-thumb.jpg",
    read_at: null,
  },
  {
    __typename: "Article" as const,
    id: "article-2",
    title: "TypeScript Best Practices",
    url: "https://example.com/ts-best-practices",
    description: "Learn the best practices for TypeScript",
    pub_date: "Tue, 02 Jan 2024 00:00:00 GMT",
    thumbnail_url: null,
    read_at: "2024-01-02T00:00:00.000Z",
  },
  {
    __typename: "Article" as const,
    id: "article-3",
    title: "Understanding GraphQL",
    url: "https://example.com/graphql-guide",
    description: null,
    pub_date: null,
    thumbnail_url: null,
    read_at: null,
  },
];

export const RecentArticlesQueryMocks = {
  Loading: createMockQuery(RecentArticlesQuery, mockLoadingResolver),
  Success: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: mockRecentArticles },
    });
  }),
  Empty: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: [] },
    });
  }),
  Error: createMockQuery(RecentArticlesQuery, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to fetch recent articles" }],
    });
  }),
};
