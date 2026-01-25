import type { Meta, StoryObj } from "@storybook/react";
import { SidePanel } from ".";
import { ArticlesListQueryMocks } from "./article-list/ArticlesQuery.mocks";
import { BookmarksQueryMocks } from "./bookmark-check/BookmarksQuery.mocks";
import { CreateBookmarkMutationMocks } from "./bookmark-check/CreateBookmarkMutation.mocks";
import { BookmarksListQueryMocks } from "./bookmark-list/BookmarksQuery.mocks";

const meta = {
  component: SidePanel,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    initialUrl: "https://example.com",
    initialTitle: "Example Page",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Empty,
        BookmarksListQueryMocks.Success,
        ArticlesListQueryMocks.Success,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};

export const WithExistingBookmark: Story = {
  args: {
    initialUrl: "https://example.com",
    initialTitle: "Example Bookmark",
  },
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Success,
        BookmarksListQueryMocks.Success,
        ArticlesListQueryMocks.Success,
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Loading,
        BookmarksListQueryMocks.Loading,
        ArticlesListQueryMocks.Loading,
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Error,
        BookmarksListQueryMocks.Error,
        ArticlesListQueryMocks.Error,
      ],
    },
  },
};

export const EmptyState: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Empty,
        BookmarksListQueryMocks.Empty,
        ArticlesListQueryMocks.Empty,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};
