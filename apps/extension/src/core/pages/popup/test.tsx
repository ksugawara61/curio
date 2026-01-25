import { render, screen } from "@curio/testing-library";
import { describe, expect, it } from "vitest";
import { Popup } from ".";

describe("Popup", () => {
  it("renders the title", () => {
    render(<Popup />);
    expect(screen.getByText("Hello World Popup!")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Curio Extension!")).toBeInTheDocument();
  });
});
