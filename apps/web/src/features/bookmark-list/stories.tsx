import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkList } from ".";
import {
  ArchivedBookmarksQueryMocks,
  BookmarksQueryMocks,
} from "./BookmarksQuery.mocks";

const meta = {
  component: BookmarkList,
} satisfies Meta<typeof BookmarkList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Success,
        ArchivedBookmarksQueryMocks.Empty,
      ],
    },
  },
};

export const WithArchivedBookmarks: Story = {
  parameters: {
    msw: {
      handlers: [
        BookmarksQueryMocks.Success,
        ArchivedBookmarksQueryMocks.WithData,
      ],
    },
  },
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Empty, ArchivedBookmarksQueryMocks.Empty],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [BookmarksQueryMocks.Error, ArchivedBookmarksQueryMocks.Empty],
    },
  },
};
