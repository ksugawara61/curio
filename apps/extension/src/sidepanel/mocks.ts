import {
  createMockQuery,
  GetArticles,
  mockLoadingResolver,
} from "@curio/graphql-client";
import { HttpResponse } from "msw";

const mockArticles = [
  {
    id: "1",
    title: "Test Article 1",
    body: "This is a test article body",
    url: "https://example.com/article1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user: {
      name: "Test User",
    },
    tags: [{ name: "React" }, { name: "TypeScript" }],
  },
  {
    id: "2",
    title: "Test Article 2",
    body: "This is another test article",
    url: "https://example.com/article2",
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    user: {
      name: "Another User",
    },
    tags: [{ name: "JavaScript" }],
  },
];

export const GetArticlesMocks = {
  Loading: createMockQuery(GetArticles, mockLoadingResolver),
  Success: createMockQuery(GetArticles, () => {
    return HttpResponse.json({
      data: { articles: mockArticles },
    });
  }),
  SingleArticle: createMockQuery(GetArticles, () => {
    return HttpResponse.json({
      data: {
        articles: [
          {
            id: "1",
            title: "Test Article",
            body: "Test body",
            url: "https://example.com/test",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            user: {
              name: "Test User",
            },
            tags: [],
          },
        ],
      },
    });
  }),
  Error: createMockQuery(GetArticles, () => {
    return HttpResponse.json({
      errors: [
        {
          message: "Failed to fetch articles",
        },
      ],
    });
  }),
};
