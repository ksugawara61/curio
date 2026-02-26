import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { RssArticlesQuery } from "./RssArticlesQuery";

const mockRssArticles = [
  {
    __typename: "Article" as const,
    title: "Getting Started with React",
    url: "https://example.com/react-intro",
    description: "A beginner's guide to React development",
    pub_date: "Mon, 01 Jan 2024 00:00:00 GMT",
    thumbnail_url: "https://example.com/react-thumb.jpg",
  },
  {
    __typename: "Article" as const,
    title: "TypeScript Best Practices",
    url: "https://example.com/ts-best-practices",
    description: "Learn the best practices for TypeScript",
    pub_date: "Tue, 02 Jan 2024 00:00:00 GMT",
    thumbnail_url: null,
  },
  {
    __typename: "Article" as const,
    title: "Understanding GraphQL",
    url: "https://example.com/graphql-guide",
    description: null,
    pub_date: null,
    thumbnail_url: null,
  },
];

export const RssArticlesQueryMocks = {
  Loading: createMockQuery(RssArticlesQuery, mockLoadingResolver),
  Success: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: mockRssArticles },
    });
  }),
  Empty: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: [] },
    });
  }),
  Error: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to fetch RSS articles" }],
    });
  }),
};
