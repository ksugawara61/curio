import type { Meta, StoryObj } from "@storybook/react";
import { Popup } from ".";

const meta = {
  component: Popup,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
