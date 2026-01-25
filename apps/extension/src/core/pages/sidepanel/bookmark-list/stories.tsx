import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkList } from ".";
import { BookmarksListQueryMocks } from "./BookmarksQuery.mocks";

const meta = {
  component: BookmarkList,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
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

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksListQueryMocks.Loading],
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
