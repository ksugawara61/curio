import { describe, expect, it } from "vitest";
import { createBookmarkUseCase } from "./CreateBookmarkUseCase";

describe("CreateBookmarkUseCase", () => {
  describe("正常系", () => {
    it("should create a bookmark successfully", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      };

      const result = await createBookmarkUseCase(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const result = await createBookmarkUseCase(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBeNull();
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });
  });
});
