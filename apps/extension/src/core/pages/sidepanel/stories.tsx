import type { Meta, StoryObj } from "@storybook/react";
import { CreateBookmarkMutationMocks } from "../../shared/graphql/mutations/CreateBookmarkMutation.mocks";
import { ArticlesListQueryMocks } from "../../shared/graphql/queries/ArticlesQuery.mocks";
import { BookmarkQueryMocks } from "../../shared/graphql/queries/BookmarkQuery.mocks";
import { BookmarksListQueryMocks } from "../../shared/graphql/queries/BookmarksQuery.mocks";
import { SidePanel } from ".";

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
