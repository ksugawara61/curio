import { describe, expect, it } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { bookmark } from ".";

describe("bookmark", () => {
  describe("正常系", () => {
    it("should return bookmark when found", async () => {
      const bookmark = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      });

      const result = await bookmark(bookmark.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(bookmark.id);
      expect(result?.title).toBe(bookmark.title);
      expect(result?.url).toBe(bookmark.url);
      expect(result?.description).toBe(bookmark.description);
    });

    it("should return null when bookmark not found", async () => {
      const nonExistentId = "non-existent-id";

      const result = await bookmark(nonExistentId);

      expect(result).toBeNull();
    });
  });
});
