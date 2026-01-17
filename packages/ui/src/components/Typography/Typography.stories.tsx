import type { Meta, StoryObj } from "@storybook/react";
import { Typography } from "./Typography";

const meta = {
  title: "Components/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is a default paragraph with base typography styling.",
  },
};

export const Heading1: Story = {
  args: {
    as: "h1",
    size: "2xl",
    children: "This is a Heading 1",
  },
};

export const Heading2: Story = {
  args: {
    as: "h2",
    size: "xl",
    children: "This is a Heading 2",
  },
};

export const Heading3: Story = {
  args: {
    as: "h3",
    size: "lg",
    children: "This is a Heading 3",
  },
};

export const Heading4: Story = {
  args: {
    as: "h4",
    size: "base",
    children: "This is a Heading 4",
  },
};

export const Heading5: Story = {
  args: {
    as: "h5",
    size: "sm",
    children: "This is a Heading 5",
  },
};

export const Heading6: Story = {
  args: {
    as: "h6",
    size: "sm",
    children: "This is a Heading 6",
  },
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography size="sm">
        Small size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography size="base">
        Base size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography size="lg">
        Large size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
      <Typography size="xl">
        Extra large size - Lorem ipsum dolor sit amet, consectetur adipiscing
        elit.
      </Typography>
      <Typography size="2xl">
        2XL size - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </Typography>
    </div>
  ),
};

export const Span: Story = {
  args: {
    as: "span",
    size: "base",
    children: "This is an inline span element with typography styling.",
  },
};

export const Div: Story = {
  args: {
    as: "div",
    size: "lg",
    children:
      "This is a div element with large typography styling. It can contain multiple lines of text and will respect the prose classes from Tailwind.",
  },
};

export const AllHeadings: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography as="h1" size="2xl">
        Heading 1 (2xl)
      </Typography>
      <Typography as="h2" size="xl">
        Heading 2 (xl)
      </Typography>
      <Typography as="h3" size="lg">
        Heading 3 (lg)
      </Typography>
      <Typography as="h4" size="base">
        Heading 4 (base)
      </Typography>
      <Typography as="h5" size="sm">
        Heading 5 (sm)
      </Typography>
      <Typography as="h6" size="sm">
        Heading 6 (sm)
      </Typography>
      <Typography as="p" size="base">
        Paragraph (base)
      </Typography>
    </div>
  ),
};
