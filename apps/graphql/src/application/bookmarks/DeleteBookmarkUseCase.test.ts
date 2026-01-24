import { describe, expect, it } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { deleteBookmarkUseCase } from "./DeleteBookmarkUseCase";

describe("DeleteBookmarkUseCase", () => {
  describe("正常系", () => {
    it("should delete a bookmark successfully", async () => {
      const bookmark = await bookmarkRepository.create({
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      });

      const result = await deleteBookmarkUseCase(bookmark.id);

      expect(result).toBe(true);

      const deletedBookmark = await bookmarkRepository.findById(bookmark.id);
      expect(deletedBookmark).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";

      await expect(deleteBookmarkUseCase(nonExistentId)).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
