import { render, screen } from "@testing-library/react";
import HomeScreen from "./index";

describe("HomeScreen", () => {
  it("renders Hello World text", () => {
    render(<HomeScreen />);
    expect(screen.getByText("Hello World")).toBeTruthy();
  });
});
