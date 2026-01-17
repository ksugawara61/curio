import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { HStack } from "./HStack";

const meta = {
  title: "Components/Layout/HStack",
  component: HStack,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <HStack>
      <div className="bg-blue-200 p-4">Item 1</div>
      <div className="bg-blue-200 p-4">Item 2</div>
      <div className="bg-blue-200 p-4">Item 3</div>
    </HStack>
  ),
};

export const WithSpacing: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Typography as="h3" size="lg">
          Spacing: 0
        </Typography>
        <HStack spacing={0}>
          <div className="bg-green-200 p-4">Item 1</div>
          <div className="bg-green-200 p-4">Item 2</div>
          <div className="bg-green-200 p-4">Item 3</div>
        </HStack>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 2
        </Typography>
        <HStack spacing={2}>
          <div className="bg-green-200 p-4">Item 1</div>
          <div className="bg-green-200 p-4">Item 2</div>
          <div className="bg-green-200 p-4">Item 3</div>
        </HStack>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 4
        </Typography>
        <HStack spacing={4}>
          <div className="bg-green-200 p-4">Item 1</div>
          <div className="bg-green-200 p-4">Item 2</div>
          <div className="bg-green-200 p-4">Item 3</div>
        </HStack>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 8
        </Typography>
        <HStack spacing={8}>
          <div className="bg-green-200 p-4">Item 1</div>
          <div className="bg-green-200 p-4">Item 2</div>
          <div className="bg-green-200 p-4">Item 3</div>
        </HStack>
      </div>
    </div>
  ),
};

export const AlignStart: Story = {
  args: {},
  render: () => (
    <HStack align="start" className="bg-gray-100 p-4" spacing={4}>
      <div className="bg-purple-200 p-4" style={{ height: "60px" }}>
        Short
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "100px" }}>
        Medium
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "140px" }}>
        Tall
      </div>
    </HStack>
  ),
};

export const AlignCenter: Story = {
  args: {},
  render: () => (
    <HStack align="center" className="bg-gray-100 p-4" spacing={4}>
      <div className="bg-purple-200 p-4" style={{ height: "60px" }}>
        Short
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "100px" }}>
        Medium
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "140px" }}>
        Tall
      </div>
    </HStack>
  ),
};

export const AlignEnd: Story = {
  args: {},
  render: () => (
    <HStack align="end" className="bg-gray-100 p-4" spacing={4}>
      <div className="bg-purple-200 p-4" style={{ height: "60px" }}>
        Short
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "100px" }}>
        Medium
      </div>
      <div className="bg-purple-200 p-4" style={{ height: "140px" }}>
        Tall
      </div>
    </HStack>
  ),
};

export const JustifyCenter: Story = {
  args: {},
  render: () => (
    <HStack className="bg-gray-100 p-4" justify="center" spacing={4}>
      <div className="bg-orange-200 p-4">Item 1</div>
      <div className="bg-orange-200 p-4">Item 2</div>
      <div className="bg-orange-200 p-4">Item 3</div>
    </HStack>
  ),
};

export const JustifyBetween: Story = {
  args: {},
  render: () => (
    <HStack className="bg-gray-100 p-4" justify="between" spacing={4}>
      <div className="bg-orange-200 p-4">Item 1</div>
      <div className="bg-orange-200 p-4">Item 2</div>
      <div className="bg-orange-200 p-4">Item 3</div>
    </HStack>
  ),
};

export const JustifyEvenly: Story = {
  args: {},
  render: () => (
    <HStack className="bg-gray-100 p-4" justify="evenly" spacing={4}>
      <div className="bg-orange-200 p-4">Item 1</div>
      <div className="bg-orange-200 p-4">Item 2</div>
      <div className="bg-orange-200 p-4">Item 3</div>
    </HStack>
  ),
};

export const WithPadding: Story = {
  args: {},
  render: () => (
    <HStack className="bg-gray-100" p={6} spacing={4}>
      <div className="bg-pink-200 p-4">Item 1</div>
      <div className="bg-pink-200 p-4">Item 2</div>
      <div className="bg-pink-200 p-4">Item 3</div>
    </HStack>
  ),
};

export const WithButtons: Story = {
  args: {},
  render: () => (
    <HStack p={6} spacing={4}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="accent">Accent</Button>
    </HStack>
  ),
};

export const ButtonGroup: Story = {
  args: {},
  render: () => (
    <HStack align="center" spacing={2}>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Reset</Button>
    </HStack>
  ),
};

export const WithTypography: Story = {
  args: {},
  render: () => (
    <HStack align="center" p={6} spacing={4}>
      <Typography as="span" size="lg">
        Label:
      </Typography>
      <Typography as="span" size="base">
        Value text here
      </Typography>
    </HStack>
  ),
};
