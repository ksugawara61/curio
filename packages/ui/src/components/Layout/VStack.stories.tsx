import type { Story } from "@ladle/react";
import { Button } from "../Button/Button";
import { Typography } from "../Typography/Typography";
import type { VStackProps } from "./VStack";
import { VStack } from "./VStack";

export const Default: Story<VStackProps> = () => (
  <VStack>
    <div className="bg-blue-200 p-4">Item 1</div>
    <div className="bg-blue-200 p-4">Item 2</div>
    <div className="bg-blue-200 p-4">Item 3</div>
  </VStack>
);

export const WithSpacing: Story<VStackProps> = () => (
  <div className="flex flex-col gap-8">
    <div>
      <Typography as="h3" size="lg">
        Spacing: 0
      </Typography>
      <VStack spacing={0}>
        <div className="bg-green-200 p-4">Item 1</div>
        <div className="bg-green-200 p-4">Item 2</div>
        <div className="bg-green-200 p-4">Item 3</div>
      </VStack>
    </div>
    <div>
      <Typography as="h3" size="lg">
        Spacing: 2
      </Typography>
      <VStack spacing={2}>
        <div className="bg-green-200 p-4">Item 1</div>
        <div className="bg-green-200 p-4">Item 2</div>
        <div className="bg-green-200 p-4">Item 3</div>
      </VStack>
    </div>
    <div>
      <Typography as="h3" size="lg">
        Spacing: 4
      </Typography>
      <VStack spacing={4}>
        <div className="bg-green-200 p-4">Item 1</div>
        <div className="bg-green-200 p-4">Item 2</div>
        <div className="bg-green-200 p-4">Item 3</div>
      </VStack>
    </div>
    <div>
      <Typography as="h3" size="lg">
        Spacing: 8
      </Typography>
      <VStack spacing={8}>
        <div className="bg-green-200 p-4">Item 1</div>
        <div className="bg-green-200 p-4">Item 2</div>
        <div className="bg-green-200 p-4">Item 3</div>
      </VStack>
    </div>
  </div>
);

export const AlignStart: Story<VStackProps> = () => (
  <VStack align="start" className="bg-gray-100 p-4" spacing={4}>
    <div className="bg-purple-200 p-4">Short</div>
    <div className="bg-purple-200 p-4">Medium length item</div>
    <div className="bg-purple-200 p-4">Very long item with more text</div>
  </VStack>
);

export const AlignCenter: Story<VStackProps> = () => (
  <VStack align="center" className="bg-gray-100 p-4" spacing={4}>
    <div className="bg-purple-200 p-4">Short</div>
    <div className="bg-purple-200 p-4">Medium length item</div>
    <div className="bg-purple-200 p-4">Very long item with more text</div>
  </VStack>
);

export const AlignEnd: Story<VStackProps> = () => (
  <VStack align="end" className="bg-gray-100 p-4" spacing={4}>
    <div className="bg-purple-200 p-4">Short</div>
    <div className="bg-purple-200 p-4">Medium length item</div>
    <div className="bg-purple-200 p-4">Very long item with more text</div>
  </VStack>
);

export const JustifyCenter: Story<VStackProps> = () => (
  <VStack
    className="bg-gray-100 p-4"
    justify="center"
    spacing={4}
    style={{ height: "400px" }}
  >
    <div className="bg-orange-200 p-4">Item 1</div>
    <div className="bg-orange-200 p-4">Item 2</div>
    <div className="bg-orange-200 p-4">Item 3</div>
  </VStack>
);

export const JustifyBetween: Story<VStackProps> = () => (
  <VStack
    className="bg-gray-100 p-4"
    justify="between"
    spacing={4}
    style={{ height: "400px" }}
  >
    <div className="bg-orange-200 p-4">Item 1</div>
    <div className="bg-orange-200 p-4">Item 2</div>
    <div className="bg-orange-200 p-4">Item 3</div>
  </VStack>
);

export const WithPadding: Story<VStackProps> = () => (
  <VStack className="bg-gray-100" p={6} spacing={4}>
    <div className="bg-pink-200 p-4">Item 1</div>
    <div className="bg-pink-200 p-4">Item 2</div>
    <div className="bg-pink-200 p-4">Item 3</div>
  </VStack>
);

export const WithButtons: Story<VStackProps> = () => (
  <VStack align="start" p={6} spacing={4}>
    <Button variant="primary">Primary Button</Button>
    <Button variant="secondary">Secondary Button</Button>
    <Button variant="accent">Accent Button</Button>
  </VStack>
);

export const WithTypography: Story<VStackProps> = () => (
  <VStack p={6} spacing={4}>
    <Typography as="h1" size="2xl">
      Welcome to VStack
    </Typography>
    <Typography as="p" size="base">
      This is a paragraph demonstrating how VStack can be used with Typography
      components to create vertically stacked text content.
    </Typography>
    <Typography as="p" size="sm">
      You can combine different sizes and elements together.
    </Typography>
  </VStack>
);
