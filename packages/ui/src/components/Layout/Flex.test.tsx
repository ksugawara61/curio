import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flex } from "./Flex";

describe("Flex", () => {
  it("renders children correctly", () => {
    render(
      <Flex>
        <div>Child 1</div>
        <div>Child 2</div>
      </Flex>,
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies flex class by default", () => {
    const { container } = render(
      <Flex>
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
  });

  it("applies direction classes correctly", () => {
    const { container, rerender } = render(
      <Flex direction="row">
        <div>Content</div>
      </Flex>,
    );
    let element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex-row");

    rerender(
      <Flex direction="col">
        <div>Content</div>
      </Flex>,
    );
    element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex-col");

    rerender(
      <Flex direction="row-reverse">
        <div>Content</div>
      </Flex>,
    );
    element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex-row-reverse");
  });

  it("applies wrap classes correctly", () => {
    const { container } = render(
      <Flex wrap="wrap">
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex-wrap");
  });

  it("applies spacing gap class", () => {
    const { container } = render(
      <Flex spacing={4}>
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("gap-4");
  });

  it("applies align classes correctly", () => {
    const { container } = render(
      <Flex align="center">
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("items-center");
  });

  it("applies justify classes correctly", () => {
    const { container } = render(
      <Flex justify="between">
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("justify-between");
  });

  it("applies padding and margin classes", () => {
    const { container } = render(
      <Flex m={2} my={8} p={4} px={6}>
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("p-4");
    expect(element).toHaveClass("px-6");
    expect(element).toHaveClass("m-2");
    expect(element).toHaveClass("my-8");
  });

  it("merges custom className", () => {
    const { container } = render(
      <Flex className="custom-class">
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("custom-class");
  });

  it("combines all props correctly", () => {
    const { container } = render(
      <Flex
        align="center"
        direction="col"
        justify="between"
        p={6}
        spacing={4}
        wrap="wrap"
      >
        <div>Content</div>
      </Flex>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("flex-col");
    expect(element).toHaveClass("flex-wrap");
    expect(element).toHaveClass("gap-4");
    expect(element).toHaveClass("items-center");
    expect(element).toHaveClass("justify-between");
    expect(element).toHaveClass("p-6");
  });
});
