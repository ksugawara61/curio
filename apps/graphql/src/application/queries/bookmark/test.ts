import { describe, expect, it } from "vitest";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepository";
import { bookmark } from ".";

describe("bookmark", () => {
  describe("正常系", () => {
    it("should return bookmark when found", async () => {
      const createdBookmark = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      });

      const result = await bookmark(createdBookmark.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBookmark.id);
      expect(result?.title).toBe(createdBookmark.title);
      expect(result?.url).toBe(createdBookmark.url);
      expect(result?.description).toBe(createdBookmark.description);
    });

    it("should return null when bookmark not found", async () => {
      const nonExistentId = "non-existent-id";

      const result = await bookmark(nonExistentId);

      expect(result).toBeNull();
    });
  });
});
