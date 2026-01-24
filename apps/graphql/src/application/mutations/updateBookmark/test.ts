import { describe, expect, it } from "vitest";
import { createDb } from "../../../libs/drizzle/client";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";
import { updateBookmark } from ".";

describe("updateBookmark", () => {
  describe("正常系", () => {
    it("should update a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
        return await repository.create({
          title: "Original Title",
          url: "https://example.com",
          description: "Original description",
        });
      });

      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const result = await updateBookmark(bookmark.id, updateInput);

      expect(result.id).toBe(bookmark.id);
      expect(result.title).toBe(updateInput.title);
      expect(result.url).toBe(bookmark.url);
      expect(result.description).toBe(updateInput.description);
      expect(result.updated_at.getTime()).toBeGreaterThan(
        result.created_at.getTime(),
      );
    });

    it("should update partial fields only", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
        return await repository.create({
          title: "Original Title",
          url: "https://example.com",
          description: "Original description",
        });
      });

      const updateInput = {
        title: "Updated Title Only",
      };

      const result = await updateBookmark(bookmark.id, updateInput);

      expect(result.id).toBe(bookmark.id);
      expect(result.title).toBe(updateInput.title);
      expect(result.url).toBe(bookmark.url);
      expect(result.description).toBe(bookmark.description);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";
      const updateInput = {
        title: "Updated Title",
      };

      await expect(
        updateBookmark(nonExistentId, updateInput),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
