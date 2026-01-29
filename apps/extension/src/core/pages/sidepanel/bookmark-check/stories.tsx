import type { Meta, StoryObj } from "@storybook/react";
import { CreateBookmarkMutationMocks } from "../../shared/graphql/CreateBookmarkMutation.mocks";
import { BookmarkQueryMocks } from "../../shared/graphql/BookmarkQuery.mocks";
import { BookmarkCheck } from ".";

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
        BookmarkQueryMocks.NotFound,
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
      handlers: [BookmarkQueryMocks.Success],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [BookmarkQueryMocks.Error],
    },
  },
};
