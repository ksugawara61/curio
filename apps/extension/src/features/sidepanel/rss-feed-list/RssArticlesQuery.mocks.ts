import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { RssArticlesQuery } from "./RssArticlesQuery";

const mockRssArticles = [
  {
    __typename: "RssArticle" as const,
    title: "Getting Started with React",
    link: "https://example.com/react-intro",
    description: "A beginner's guide to React development",
    pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
    thumbnailUrl: "https://example.com/react-thumb.jpg",
  },
  {
    __typename: "RssArticle" as const,
    title: "TypeScript Best Practices",
    link: "https://example.com/ts-best-practices",
    description: "Learn the best practices for TypeScript",
    pubDate: "Tue, 02 Jan 2024 00:00:00 GMT",
    thumbnailUrl: null,
  },
  {
    __typename: "RssArticle" as const,
    title: "Understanding GraphQL",
    link: "https://example.com/graphql-guide",
    description: null,
    pubDate: null,
    thumbnailUrl: null,
  },
];

export const RssArticlesQueryMocks = {
  Loading: createMockQuery(RssArticlesQuery, mockLoadingResolver),
  Success: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      data: { rssArticles: mockRssArticles },
    });
  }),
  Empty: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      data: { rssArticles: [] },
    });
  }),
  Error: createMockQuery(RssArticlesQuery, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to fetch RSS articles" }],
    });
  }),
};
