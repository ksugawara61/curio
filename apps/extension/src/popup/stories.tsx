import type { Meta, StoryObj } from "@storybook/react";
import { Popup } from "./Popup";

const meta = {
  component: Popup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
