import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { CreateRssFeedMutation } from "./CreateRssFeedMutation";

export const CreateRssFeedMutationMocks = {
  Loading: createMockMutation(CreateRssFeedMutation, mockLoadingResolver),
  Success: createMockMutation(CreateRssFeedMutation, async ({ request }) => {
    const body = (await request.json()) as {
      variables?: { url?: string };
    } | null;
    const url = body?.variables?.url ?? "https://example.com/rss.xml";
    return HttpResponse.json({
      data: {
        createRssFeed: {
          __typename: "RssFeed" as const,
          id: "new-feed-id",
          url,
          title: "New Feed",
          description: "A newly added feed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    });
  }),
  Error: createMockMutation(CreateRssFeedMutation, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to create RSS feed" }],
    });
  }),
  Conflict: createMockMutation(CreateRssFeedMutation, () => {
    return HttpResponse.json({
      errors: [{ message: "RSS feed with this URL is already registered" }],
    });
  }),
};
