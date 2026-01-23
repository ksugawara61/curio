import { describe, expect, it } from "vitest";
import {
  type HelloUseCaseInput,
  type HelloUseCaseOutput,
  helloUseCase,
} from "./hello.usecase";

describe("helloUseCase", () => {
  it("should return world message", () => {
    // Arrange
    const input: HelloUseCaseInput = {};

    // Act
    const result: HelloUseCaseOutput = helloUseCase(input);

    // Assert
    expect(result).toEqual({
      message: "world",
    });
  });

  it("should return string message", () => {
    // Arrange
    const input: HelloUseCaseInput = {};

    // Act
    const result = helloUseCase(input);

    // Assert
    expect(typeof result.message).toBe("string");
  });

  it("should not be empty message", () => {
    // Arrange
    const input: HelloUseCaseInput = {};

    // Act
    const result = helloUseCase(input);

    // Assert
    expect(result.message).not.toBe("");
    expect(result.message.length).toBeGreaterThan(0);
  });
});
