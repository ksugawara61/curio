import { describe, expect, it } from "vitest";
import { createDb } from "../../../libs/drizzle/client";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";
import { bookmark } from ".";

describe("bookmark", () => {
  describe("正常系", () => {
    it("should return bookmark when found", async () => {
      const db = createDb();
      const createdBookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
        return await repository.create({
          title: "Test Bookmark",
          url: "https://example.com",
          description: "A test bookmark",
        });
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
