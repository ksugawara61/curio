import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VStack } from "./VStack";

describe("VStack", () => {
  it("renders children correctly", () => {
    render(
      <VStack>
        <div>Child 1</div>
        <div>Child 2</div>
      </VStack>,
    );
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("applies flex and flex-col classes by default", () => {
    const { container } = render(
      <VStack>
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("flex-col");
  });

  it("applies spacing gap class", () => {
    const { container } = render(
      <VStack spacing={4}>
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("gap-4");
  });

  it("applies align classes correctly", () => {
    const { container, rerender } = render(
      <VStack align="center">
        <div>Content</div>
      </VStack>,
    );
    let element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("items-center");

    rerender(
      <VStack align="start">
        <div>Content</div>
      </VStack>,
    );
    element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("items-start");
  });

  it("applies justify classes correctly", () => {
    const { container } = render(
      <VStack justify="between">
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("justify-between");
  });

  it("applies padding classes", () => {
    const { container } = render(
      <VStack p={4} pb={6} pt={2}>
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("p-4");
    expect(element).toHaveClass("pt-2");
    expect(element).toHaveClass("pb-6");
  });

  it("applies margin classes", () => {
    const { container } = render(
      <VStack m={4} mx={8}>
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("m-4");
    expect(element).toHaveClass("mx-8");
  });

  it("merges custom className", () => {
    const { container } = render(
      <VStack className="custom-class">
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("flex");
    expect(element).toHaveClass("custom-class");
  });

  it("passes through HTML attributes", () => {
    const { container } = render(
      <VStack data-testid="vstack" id="my-stack">
        <div>Content</div>
      </VStack>,
    );
    const element = container.firstChild as HTMLElement;
    expect(element).toHaveAttribute("data-testid", "vstack");
    expect(element).toHaveAttribute("id", "my-stack");
  });
});
