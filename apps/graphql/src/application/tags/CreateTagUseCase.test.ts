import { describe, expect, it } from "vitest";
import { createTagUseCase } from "./CreateTagUseCase";

describe("CreateTagUseCase", () => {
  describe("正常系", () => {
    it("should create a tag successfully", async () => {
      const input = {
        name: "Test Tag",
      };

      const result = await createTagUseCase(input);

      expect(result).toHaveProperty("id");
      expect(result.name).toBe(input.name);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should handle unique constraint on tag name", async () => {
      const input = {
        name: "Unique Tag",
      };

      // Create first tag
      await createTagUseCase(input);

      // Attempt to create second tag with same name should throw error
      await expect(createTagUseCase(input)).rejects.toThrow();
    });
  });
});
