import type { Meta, StoryObj } from "@storybook/react";
import { SidePanel } from "./SidePanel";

const meta = {
  component: SidePanel,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
