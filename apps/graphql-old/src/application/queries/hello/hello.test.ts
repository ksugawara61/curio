import { describe, expect, it } from "vitest";
import { type HelloInput, type HelloOutput, hello } from "./hello";

describe("hello", () => {
  it("should return world message", () => {
    // Arrange
    const input: HelloInput = {};

    // Act
    const result: HelloOutput = hello(input);

    // Assert
    expect(result).toEqual({
      message: "world",
    });
  });

  it("should return string message", () => {
    // Arrange
    const input: HelloInput = {};

    // Act
    const result = hello(input);

    // Assert
    expect(typeof result.message).toBe("string");
  });

  it("should not be empty message", () => {
    // Arrange
    const input: HelloInput = {};

    // Act
    const result = hello(input);

    // Assert
    expect(result.message).not.toBe("");
    expect(result.message.length).toBeGreaterThan(0);
  });
});
