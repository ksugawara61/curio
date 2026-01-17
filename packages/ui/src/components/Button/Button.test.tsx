import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-md");
    expect(button).toHaveAttribute("type", "button");
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-secondary");

    rerender(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-accent");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-ghost");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-link");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="xs">XSmall</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-xs");

    rerender(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-lg");

    rerender(<Button size="xl">XLarge</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-xl");
  });

  it("applies block class when block prop is true", () => {
    render(<Button block>Block Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn-block");
  });

  it("merges custom className", () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("custom-class");
  });

  it("passes through button attributes", () => {
    render(
      <Button disabled type="submit">
        Submit
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
  });

  it("combines variant, size, and block classes", () => {
    render(
      <Button block size="lg" variant="primary">
        Combined
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn");
    expect(button).toHaveClass("btn-primary");
    expect(button).toHaveClass("btn-lg");
    expect(button).toHaveClass("btn-block");
  });
});
