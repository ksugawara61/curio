import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { updateBookmark } from ".";

describe("updateBookmark", () => {
  describe("正常系", () => {
    it("should update a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Original Title",
          url: `https://example.com/update-test-1-${Date.now()}`,
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
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Original Title",
          url: `https://example.com/update-test-2-${Date.now()}`,
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

    it("should allow updating to the same URL", async () => {
      const db = createDb();
      const url = `https://example.com/update-same-url-${Date.now()}`;
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Original Title",
          url,
          description: "Original description",
        });
      });

      const updateInput = {
        url,
        title: "Updated Title",
      };

      const result = await updateBookmark(bookmark.id, updateInput);

      expect(result.id).toBe(bookmark.id);
      expect(result.url).toBe(url);
      expect(result.title).toBe(updateInput.title);
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

    it("should throw error when updating to an existing URL", async () => {
      const db = createDb();
      const existingUrl = `https://example.com/existing-url-${Date.now()}`;

      // Create first bookmark with a specific URL
      await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "First Bookmark",
          url: existingUrl,
        });
      });

      // Create second bookmark with a different URL
      const secondBookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Second Bookmark",
          url: `https://example.com/second-url-${Date.now()}`,
        });
      });

      // Try to update second bookmark to use the existing URL
      await expect(
        updateBookmark(secondBookmark.id, { url: existingUrl }),
      ).rejects.toThrowError(/Bookmark with this URL already exists/);
    });
  });
});
