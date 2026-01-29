import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkQueryMocks } from "../../shared/graphql/queries/BookmarkQuery.mocks";
import { Popup } from ".";

const meta = {
  component: Popup,
  args: {
    initialUrl: "https://example.com",
    initialTitle: "Example Page",
  },
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Bookmarked: Story = {
  parameters: {
    msw: {
      handlers: [BookmarkQueryMocks.Success],
    },
  },
};

export const NotBookmarked: Story = {
  parameters: {
    msw: {
      handlers: [BookmarkQueryMocks.NotFound],
    },
  },
};
