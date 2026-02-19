import type { Meta, StoryObj } from "@storybook/react";
import { BookmarkAddForm } from "./BookmarkAddForm";

const meta = {
  component: BookmarkAddForm,
} satisfies Meta<typeof BookmarkAddForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "https://example.com/article",
    defaultTitle: "An Interesting Article",
    defaultDescription: "This is a description of the article.",
    defaultThumbnail: "",
    onSuccess: () => {},
  },
};

export const WithThumbnail: Story = {
  args: {
    url: "https://react.dev",
    defaultTitle: "React Documentation",
    defaultDescription: "The official React documentation site.",
    defaultThumbnail: "https://react.dev/images/og-home.png",
    onSuccess: () => {},
  },
};

export const EmptyFields: Story = {
  args: {
    url: "https://example.com",
    defaultTitle: "",
    defaultDescription: "",
    defaultThumbnail: "",
    onSuccess: () => {},
  },
};
