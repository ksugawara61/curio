import type { Meta, StoryObj } from "@storybook/react";
import { RssFeedList } from ".";
import { CreateRssFeedMutationMocks } from "./CreateRssFeedMutation.mocks";
import { RssArticlesQueryMocks } from "./RssArticlesQuery.mocks";
import { RssFeedsQueryMocks } from "./RssFeedsQuery.mocks";

const meta = {
  component: RssFeedList,
} satisfies Meta<typeof RssFeedList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        RssFeedsQueryMocks.Success,
        RssArticlesQueryMocks.Success,
        CreateRssFeedMutationMocks.Success,
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [RssFeedsQueryMocks.Empty, CreateRssFeedMutationMocks.Success],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [RssFeedsQueryMocks.Error],
    },
  },
};
