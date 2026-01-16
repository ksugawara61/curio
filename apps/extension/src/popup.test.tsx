import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Popup } from "./popup";

describe("Popup", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the title", () => {
    render(<Popup />);
    expect(screen.getByText("Hello World Popup!")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Curio Extension!")).toBeInTheDocument();
  });
});
