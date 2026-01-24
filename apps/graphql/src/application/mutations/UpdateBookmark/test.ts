import { describe, expect, it } from "vitest";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";
import { updateBookmarkUseCase } from "./UpdateBookmarkUseCase";

describe("UpdateBookmarkUseCase", () => {
  describe("正常系", () => {
    it("should update a bookmark successfully", async () => {
      const bookmark = await bookmarkRepository.create({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const result = await updateBookmarkUseCase(bookmark.id, updateInput);

      expect(result.id).toBe(bookmark.id);
      expect(result.title).toBe(updateInput.title);
      expect(result.url).toBe(bookmark.url);
      expect(result.description).toBe(updateInput.description);
      expect(result.updated_at.getTime()).toBeGreaterThan(
        result.created_at.getTime(),
      );
    });

    it("should update partial fields only", async () => {
      const bookmark = await bookmarkRepository.create({
        title: "Original Title",
        url: "https://example.com",
        description: "Original description",
      });

      const updateInput = {
        title: "Updated Title Only",
      };

      const result = await updateBookmarkUseCase(bookmark.id, updateInput);

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
        updateBookmarkUseCase(nonExistentId, updateInput),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
