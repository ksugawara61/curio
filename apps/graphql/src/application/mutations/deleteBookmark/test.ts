import { describe, expect, it } from "vitest";
import { createDb } from "../../../libs/drizzle/client";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";
import { deleteBookmark } from ".";

describe("deleteBookmark", () => {
  describe("正常系", () => {
    it("should delete a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
        return await repository.create({
          title: "Test Bookmark",
          url: "https://example.com",
          description: "A test bookmark",
        });
      });

      const result = await deleteBookmark(bookmark.id);

      expect(result).toBe(true);

      const repository = new BookmarkRepository();
      const deletedBookmark = await repository.findById(bookmark.id);
      expect(deletedBookmark).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";

      await expect(deleteBookmark(nonExistentId)).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
