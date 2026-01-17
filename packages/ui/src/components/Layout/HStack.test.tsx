import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HStack } from "./HStack";

describe("HStack", () => {
  it("renders children correctly", () => {
    render(
      <HStack>
        <div>Child 1</div>
        <div>Child 2</div>
      </HStack>
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies flex and flex-row classes by default", () => {
    const { container } = render(
      <HStack>
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("flex-row");
  });

  it("applies spacing gap class", () => {
    const { container } = render(
      <HStack spacing={4}>
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("gap-4");
  });

  it("applies align classes correctly", () => {
    const { container } = render(
      <HStack align="center">
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("items-center");
  });

  it("applies justify classes correctly", () => {
    const { container } = render(
      <HStack justify="between">
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("justify-between");
  });

  it("applies padding and margin classes", () => {
    const { container } = render(
      <HStack m={2} p={4}>
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("p-4");
    expect(element).toHaveClass("m-2");
  });

  it("merges custom className", () => {
    const { container } = render(
      <HStack className="custom-class">
        <div>Content</div>
      </HStack>
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("custom-class");
  });
});
