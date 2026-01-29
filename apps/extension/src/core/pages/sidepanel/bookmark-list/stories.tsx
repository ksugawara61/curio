import type { Meta, StoryObj } from "@storybook/react";
import { BookmarksListQueryMocks } from "../../../shared/graphql/queries/BookmarksQuery.mocks";
import { BookmarkList } from ".";

const meta = {
  component: BookmarkList,
} satisfies Meta<typeof BookmarkList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksListQueryMocks.Success],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksListQueryMocks.Empty],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksListQueryMocks.Error],
    },
  },
};
