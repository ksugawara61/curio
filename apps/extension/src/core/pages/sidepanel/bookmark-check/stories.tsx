import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkCheck } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";
import { CreateBookmarkMutationMocks } from "./CreateBookmarkMutation.mocks";

const meta = {
  component: BookmarkCheck,
  parameters: {
    layout: "centered",
  },
  args: {
    currentUrl: "https://example.com",
    currentTitle: "Example Page",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BookmarkCheck>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotBookmarked: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Empty,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};

export const AlreadyBookmarked: Story = {
  args: {
    currentUrl: "https://example.com",
    currentTitle: "Example Bookmark",
  },
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Success],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Loading],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Error],
    },
  },
};
