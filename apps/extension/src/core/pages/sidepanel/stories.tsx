import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkQueryMocks } from "../shared/graphql/BookmarkQuery.mocks";
import { CreateBookmarkMutationMocks } from "../shared/graphql/CreateBookmarkMutation.mocks";
import { SidePanel } from ".";
import { ArticlesListQueryMocks } from "./article-list/ArticlesQuery.mocks";
import { BookmarksListQueryMocks } from "./bookmark-list/BookmarksQuery.mocks";

const meta = {
  component: SidePanel,
  args: {
    initialUrl: "https://example.com",
    initialTitle: "Example Page",
  },
} satisfies Meta<typeof SidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarkQueryMocks.NotFound,
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
        BookmarkQueryMocks.Success,
        BookmarksListQueryMocks.Success,
        ArticlesListQueryMocks.Success,
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarkQueryMocks.Error,
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
        BookmarkQueryMocks.NotFound,
        BookmarksListQueryMocks.Empty,
        ArticlesListQueryMocks.Empty,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};
