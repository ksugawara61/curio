import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { deleteBookmark } from ".";

describe("deleteBookmark", () => {
  describe("正常系", () => {
    it("should delete a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark",
          url: "https://example.com",
          description: "A test bookmark",
        });
      });

      const result = await deleteBookmark(bookmark.id);

      expect(result).toBe(true);

      const repository = new BookmarkRepository(ContextRepository.create());
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
