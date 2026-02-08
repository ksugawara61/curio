import { describe, expect, it } from "vitest";
import { createTag } from "./create-tag";

describe("createTag", () => {
  describe("正常系", () => {
    it("should create a tag successfully", async () => {
      const input = {
        name: "Test Tag",
      };

      const result = await createTag(input);

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
      await createTag(input);

      // Attempt to create second tag with same name should throw error
      await expect(createTag(input)).rejects.toThrow();
    });
  });
});
