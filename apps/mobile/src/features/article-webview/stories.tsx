import type { Meta, StoryObj } from "@storybook/react";
import { ArticleWebView } from ".";

const meta = {
  component: ArticleWebView,
} satisfies Meta<typeof ArticleWebView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
