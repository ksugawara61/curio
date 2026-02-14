import { createMockQuery, mockLoadingResolver } from "@curio/testing-library";
import { HttpResponse } from "msw";
import { RssFeedsQuery } from "./RssFeedsQuery";

const mockRssFeeds = [
  {
    __typename: "RssFeed" as const,
    id: "feed-1",
    url: "https://example.com/rss.xml",
    title: "Example Blog",
    description: "A blog about web development",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    __typename: "RssFeed" as const,
    id: "feed-2",
    url: "https://techblog.example.com/feed",
    title: "Tech Blog",
    description: null,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
];

export const RssFeedsQueryMocks = {
  Loading: createMockQuery(RssFeedsQuery, mockLoadingResolver),
  Success: createMockQuery(RssFeedsQuery, () => {
    return HttpResponse.json({
      data: { rssFeeds: mockRssFeeds },
    });
  }),
  Empty: createMockQuery(RssFeedsQuery, () => {
    return HttpResponse.json({
      data: { rssFeeds: [] },
    });
  }),
  SingleFeed: createMockQuery(RssFeedsQuery, () => {
    return HttpResponse.json({
      data: { rssFeeds: [mockRssFeeds[0]] },
    });
  }),
  Error: createMockQuery(RssFeedsQuery, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to fetch RSS feeds" }],
    });
  }),
};
