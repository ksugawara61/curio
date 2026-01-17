import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders with default props", () => {
    render(<Typography>Hello World</Typography>);
    const element = screen.getByText("Hello World");
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe("P");
    expect(element).toHaveClass("prose");
  });

  it("renders with custom element", () => {
    render(<Typography as="h1">Heading</Typography>);
    const element = screen.getByText("Heading");
    expect(element.tagName).toBe("H1");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Typography size="sm">Small</Typography>);
    expect(screen.getByText("Small")).toHaveClass("prose-sm");

    rerender(<Typography size="lg">Large</Typography>);
    expect(screen.getByText("Large")).toHaveClass("prose-lg");

    rerender(<Typography size="xl">XLarge</Typography>);
    expect(screen.getByText("XLarge")).toHaveClass("prose-xl");

    rerender(<Typography size="2xl">2XLarge</Typography>);
    expect(screen.getByText("2XLarge")).toHaveClass("prose-2xl");
  });

  it("merges custom className", () => {
    render(<Typography className="custom-class">Text</Typography>);
    const element = screen.getByText("Text");
    expect(element).toHaveClass("prose");
    expect(element).toHaveClass("custom-class");
  });

  it("passes through additional props", () => {
    render(<Typography data-testid="custom-id">Text</Typography>);
    expect(screen.getByTestId("custom-id")).toBeInTheDocument();
  });
});
