import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkList } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";

const meta = {
  component: BookmarkList,
} satisfies Meta<typeof BookmarkList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Success],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Empty],
    },
  },
};

export const FetchError: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Error],
    },
  },
};

// ローディング状態は networkidle を待てないため VRT をスキップ
export const Loading: Story = {
  tags: ["no-vrt"],
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Loading],
    },
  },
};
