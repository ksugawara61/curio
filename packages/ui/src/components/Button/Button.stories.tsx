import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Default Button",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Accent: Story = {
  args: {
    variant: "accent",
    children: "Accent Button",
  },
};

export const Neutral: Story = {
  args: {
    variant: "neutral",
    children: "Neutral Button",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Sizes = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button size="xs" variant="primary">
        Extra Small
      </Button>
      <Button size="sm" variant="primary">
        Small
      </Button>
      <Button size="md" variant="primary">
        Medium
      </Button>
      <Button size="lg" variant="primary">
        Large
      </Button>
      <Button size="xl" variant="primary">
        Extra Large
      </Button>
    </div>
  ),
};

export const Block: Story = {
  args: {
    block: true,
    variant: "primary",
    children: "Full Width Button",
  },
};

export const Disabled = {
  render: () => (
    <div className="flex gap-4">
      <Button disabled variant="primary">
        Disabled Primary
      </Button>
      <Button disabled variant="secondary">
        Disabled Secondary
      </Button>
    </div>
  ),
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="neutral">Neutral</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
