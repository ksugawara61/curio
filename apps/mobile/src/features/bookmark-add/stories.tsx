import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkAdd } from ".";
import { BookmarksQueryMocks } from "./BookmarksQuery.mocks";
import { CreateBookmarkMutationMocks } from "./CreateBookmarkMutation.mocks";
import { FetchUrlMetadataQueryMocks } from "./FetchUrlMetadataQuery.mocks";

const meta = {
  component: BookmarkAdd,
} satisfies Meta<typeof BookmarkAdd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const UrlEntry: Story = {
  parameters: {
    msw: {
      handlers: [
        FetchUrlMetadataQueryMocks.Success,
        BookmarksQueryMocks.Success,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};

// ローディング状態は networkidle を待てないため VRT をスキップ
export const MetadataLoading: Story = {
  tags: ["no-vrt"],
  parameters: {
    msw: {
      handlers: [
        FetchUrlMetadataQueryMocks.Loading,
        BookmarksQueryMocks.Empty,
        CreateBookmarkMutationMocks.Success,
      ],
    },
  },
};
