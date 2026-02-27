import type { Meta, StoryObj } from "@storybook/react";
import { RecentArticleList } from ".";
import { RecentArticlesQueryMocks } from "./RecentArticlesQuery.mocks";

const meta = {
  component: RecentArticleList,
} satisfies Meta<typeof RecentArticleList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Success],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Empty],
    },
  },
};

export const FetchError: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Error],
    },
  },
};

// ローディング状態は networkidle を待たず VRT をスキップ
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Loading],
    },
    playwright: {
      skip: true,
    },
  },
};
