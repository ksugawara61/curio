import type { Meta, StoryObj } from "@storybook/react";
import { RssArticlesQueryMocks } from "../rss-feed-list/RssArticlesQuery.mocks";
import { RssFeedsQueryMocks } from "../rss-feed-list/RssFeedsQuery.mocks";
import { FeedsTab } from ".";
import { MarkArticleAsReadMutationMocks } from "./MarkArticleAsReadMutation.mocks";
import { RecentArticlesQueryMocks } from "./RecentArticlesQuery.mocks";

const meta = {
  component: FeedsTab,
} satisfies Meta<typeof FeedsTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        RecentArticlesQueryMocks.Success,
        MarkArticleAsReadMutationMocks.Success,
        RssFeedsQueryMocks.Success,
        RssArticlesQueryMocks.Success,
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        RecentArticlesQueryMocks.Empty,
        MarkArticleAsReadMutationMocks.Success,
        RssFeedsQueryMocks.Empty,
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Loading, RssFeedsQueryMocks.Loading],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Error, RssFeedsQueryMocks.Error],
    },
  },
};
