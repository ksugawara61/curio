import type { Meta, StoryObj } from "@storybook/react";
import { BlockedDomainsMocks } from "../../../shared/hooks/useBlockedDomains.mocks";
import { Settings } from ".";

const meta = {
  component: Settings,
} satisfies Meta<typeof Settings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBlockedDomains: Story = {
  parameters: {
    swr: {
      handlers: [BlockedDomainsMocks.WithDomains],
    },
  },
};
