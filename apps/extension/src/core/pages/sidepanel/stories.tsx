import type { Meta, StoryObj } from "@storybook/react";
import { SidePanel } from ".";
import { ArticlesQueryMocks } from "./ArticlesQuery.mocks";

const meta = {
  component: SidePanel,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesQueryMocks.Success],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesQueryMocks.Loading],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [ArticlesQueryMocks.Error],
    },
  },
};
