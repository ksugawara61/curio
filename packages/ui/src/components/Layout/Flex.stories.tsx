import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import { Flex } from "./Flex";

const meta = {
  title: "Components/Layout/Flex",
  component: Flex,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Flex>
      <div className="bg-blue-200 p-4">Item 1</div>
      <div className="bg-blue-200 p-4">Item 2</div>
      <div className="bg-blue-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const DirectionRow: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100 p-4" direction="row" spacing={4}>
      <div className="bg-green-200 p-4">Item 1</div>
      <div className="bg-green-200 p-4">Item 2</div>
      <div className="bg-green-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const DirectionColumn: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100 p-4" direction="col" spacing={4}>
      <div className="bg-green-200 p-4">Item 1</div>
      <div className="bg-green-200 p-4">Item 2</div>
      <div className="bg-green-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const DirectionRowReverse: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100 p-4" direction="row-reverse" spacing={4}>
      <div className="bg-green-200 p-4">Item 1</div>
      <div className="bg-green-200 p-4">Item 2</div>
      <div className="bg-green-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const DirectionColReverse: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100 p-4" direction="col-reverse" spacing={4}>
      <div className="bg-green-200 p-4">Item 1</div>
      <div className="bg-green-200 p-4">Item 2</div>
      <div className="bg-green-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const WrapEnabled: Story = {
  args: {},
  render: () => (
    <Flex
      className="bg-gray-100 p-4"
      direction="row"
      spacing={4}
      style={{ width: "400px" }}
      wrap="wrap"
    >
      <div className="bg-purple-200 p-4">Item 1</div>
      <div className="bg-purple-200 p-4">Item 2</div>
      <div className="bg-purple-200 p-4">Item 3</div>
      <div className="bg-purple-200 p-4">Item 4</div>
      <div className="bg-purple-200 p-4">Item 5</div>
      <div className="bg-purple-200 p-4">Item 6</div>
    </Flex>
  ),
};

export const WrapReverse: Story = {
  args: {},
  render: () => (
    <Flex
      className="bg-gray-100 p-4"
      direction="row"
      spacing={4}
      style={{ width: "400px" }}
      wrap="wrap-reverse"
    >
      <div className="bg-purple-200 p-4">Item 1</div>
      <div className="bg-purple-200 p-4">Item 2</div>
      <div className="bg-purple-200 p-4">Item 3</div>
      <div className="bg-purple-200 p-4">Item 4</div>
      <div className="bg-purple-200 p-4">Item 5</div>
      <div className="bg-purple-200 p-4">Item 6</div>
    </Flex>
  ),
};

export const AlignCenter: Story = {
  args: {},
  render: () => (
    <Flex
      align="center"
      className="bg-gray-100 p-4"
      direction="row"
      spacing={4}
    >
      <div className="bg-orange-200 p-4" style={{ height: "60px" }}>
        Short
      </div>
      <div className="bg-orange-200 p-4" style={{ height: "100px" }}>
        Medium
      </div>
      <div className="bg-orange-200 p-4" style={{ height: "140px" }}>
        Tall
      </div>
    </Flex>
  ),
};

export const JustifyCenter: Story = {
  args: {},
  render: () => (
    <Flex
      className="bg-gray-100 p-4"
      direction="row"
      justify="center"
      spacing={4}
    >
      <div className="bg-pink-200 p-4">Item 1</div>
      <div className="bg-pink-200 p-4">Item 2</div>
      <div className="bg-pink-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const JustifyBetween: Story = {
  args: {},
  render: () => (
    <Flex
      className="bg-gray-100 p-4"
      direction="row"
      justify="between"
      spacing={4}
    >
      <div className="bg-pink-200 p-4">Item 1</div>
      <div className="bg-pink-200 p-4">Item 2</div>
      <div className="bg-pink-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const JustifyEvenly: Story = {
  args: {},
  render: () => (
    <Flex
      className="bg-gray-100 p-4"
      direction="row"
      justify="evenly"
      spacing={4}
    >
      <div className="bg-pink-200 p-4">Item 1</div>
      <div className="bg-pink-200 p-4">Item 2</div>
      <div className="bg-pink-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const CenterBoth: Story = {
  args: {},
  render: () => (
    <Flex
      align="center"
      className="bg-gray-100 p-4"
      direction="row"
      justify="center"
      style={{ height: "300px" }}
    >
      <div className="bg-red-200 p-4">Centered Item</div>
    </Flex>
  ),
};

export const WithPadding: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100" direction="row" p={8} spacing={4}>
      <div className="bg-yellow-200 p-4">Item 1</div>
      <div className="bg-yellow-200 p-4">Item 2</div>
      <div className="bg-yellow-200 p-4">Item 3</div>
    </Flex>
  ),
};

export const WithButtons: Story = {
  args: {},
  render: () => (
    <Flex direction="row" justify="center" p={6} spacing={4}>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Reset</Button>
    </Flex>
  ),
};

export const ResponsiveLayout: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100" direction="row" p={6} spacing={4} wrap="wrap">
      <div className="min-w-[200px] flex-1 bg-indigo-200 p-4">Column 1</div>
      <div className="min-w-[200px] flex-1 bg-indigo-200 p-4">Column 2</div>
      <div className="min-w-[200px] flex-1 bg-indigo-200 p-4">Column 3</div>
    </Flex>
  ),
};

export const CardLayout: Story = {
  args: {},
  render: () => (
    <Flex className="bg-gray-100" direction="col" p={6} spacing={6}>
      <Typography as="h2" size="xl">
        Card Title
      </Typography>
      <Typography as="p" size="base">
        This is a card layout using Flex component. It demonstrates how to
        create a vertical layout with proper spacing and padding.
      </Typography>
      <Flex direction="row" justify="end" spacing={4}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Flex>
    </Flex>
  ),
};

export const SpacingVariations: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <Typography as="h3" size="lg">
          Spacing: 0
        </Typography>
        <Flex className="bg-gray-100 p-4" direction="row" spacing={0}>
          <div className="bg-teal-200 p-4">Item 1</div>
          <div className="bg-teal-200 p-4">Item 2</div>
          <div className="bg-teal-200 p-4">Item 3</div>
        </Flex>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 2
        </Typography>
        <Flex className="bg-gray-100 p-4" direction="row" spacing={2}>
          <div className="bg-teal-200 p-4">Item 1</div>
          <div className="bg-teal-200 p-4">Item 2</div>
          <div className="bg-teal-200 p-4">Item 3</div>
        </Flex>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 4
        </Typography>
        <Flex className="bg-gray-100 p-4" direction="row" spacing={4}>
          <div className="bg-teal-200 p-4">Item 1</div>
          <div className="bg-teal-200 p-4">Item 2</div>
          <div className="bg-teal-200 p-4">Item 3</div>
        </Flex>
      </div>
      <div>
        <Typography as="h3" size="lg">
          Spacing: 8
        </Typography>
        <Flex className="bg-gray-100 p-4" direction="row" spacing={8}>
          <div className="bg-teal-200 p-4">Item 1</div>
          <div className="bg-teal-200 p-4">Item 2</div>
          <div className="bg-teal-200 p-4">Item 3</div>
        </Flex>
      </div>
    </div>
  ),
};
