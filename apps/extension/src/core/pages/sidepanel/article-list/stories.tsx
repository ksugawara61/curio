import type { Meta, StoryObj } from "@storybook/react";
import { ArticleList } from ".";
import { ArticlesListQueryMocks } from "./ArticlesQuery.mocks";

const meta = {
  component: ArticleList,
} satisfies Meta<typeof ArticleList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesListQueryMocks.Success],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesListQueryMocks.Empty],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesListQueryMocks.Error],
    },
  },
};
