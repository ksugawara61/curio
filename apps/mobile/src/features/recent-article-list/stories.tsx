import type { Meta, StoryObj } from "@storybook/react";
import { RecentArticleList } from ".";
import { MarkArticleAsReadMutationMocks } from "./MarkArticleAsReadMutation.mocks";
import { RecentArticlesQueryMocks } from "./RecentArticlesQuery.mocks";

const meta = {
  component: RecentArticleList,
} satisfies Meta<typeof RecentArticleList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [
        RecentArticlesQueryMocks.Success,
        MarkArticleAsReadMutationMocks.Success,
      ],
    },
  },
};

export const WithReadArticle: Story = {
  parameters: {
    msw: {
      handlers: [
        RecentArticlesQueryMocks.WithReadArticle,
        MarkArticleAsReadMutationMocks.Success,
      ],
    },
  },
};

export const AllRead: Story = {
  parameters: {
    msw: {
      handlers: [
        RecentArticlesQueryMocks.AllRead,
        MarkArticleAsReadMutationMocks.Success,
      ],
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

// ローディング状態は networkidle を待てないため VRT をスキップ
// index.json には parameters が含まれないため tags で制御する
export const Loading: Story = {
  tags: ["no-vrt"],
  parameters: {
    msw: {
      handlers: [RecentArticlesQueryMocks.Loading],
    },
  },
};
