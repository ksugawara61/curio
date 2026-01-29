import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { ArticlesQuery } from "./ArticlesQuery";

const mockArticles = [
  {
    __typename: "Article" as const,
    id: "1",
    title: "Getting Started with React",
    body: "React is a JavaScript library for building user interfaces. This article covers the basics of React components, props, and state management.",
    url: "https://example.com/react-guide",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      name: "John Doe",
    },
    tags: [{ name: "React" }, { name: "JavaScript" }],
  },
  {
    __typename: "Article" as const,
    id: "2",
    title: "TypeScript Best Practices",
    body: "Learn the best practices for writing TypeScript code. This guide covers type safety, generics, and advanced patterns.",
    url: "https://example.com/typescript-best-practices",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    user: {
      name: "Jane Smith",
    },
    tags: [{ name: "TypeScript" }],
  },
  {
    __typename: "Article" as const,
    id: "3",
    title: "Building Chrome Extensions",
    body: "A comprehensive guide to building Chrome extensions with modern web technologies.",
    url: "https://example.com/chrome-extensions",
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
    user: {
      name: "Bob Wilson",
    },
    tags: [{ name: "Chrome" }, { name: "Extensions" }],
  },
];

export const ArticlesListQueryMocks = {
  Loading: createMockQuery(ArticlesQuery, mockLoadingResolver),
  Success: createMockQuery(ArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: mockArticles },
    });
  }),
  Empty: createMockQuery(ArticlesQuery, () => {
    return HttpResponse.json({
      data: { articles: [] },
    });
  }),
  SingleArticle: createMockQuery(ArticlesQuery, () => {
    return HttpResponse.json({
      data: {
        articles: [mockArticles[0]],
      },
    });
  }),
  Error: createMockQuery(ArticlesQuery, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to fetch articles",
        },
      ],
    });
  }),
};
