import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { archiveBookmark } from "../archive-bookmark";
import { unarchiveBookmark } from ".";

describe("unarchiveBookmark", () => {
  describe("正常系", () => {
    it("should unarchive a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/unarchive-test-${Date.now()}`,
          description: "A test bookmark",
        });
      });

      await archiveBookmark(bookmark.id);
      const result = await unarchiveBookmark(bookmark.id);

      expect(result.id).toBe(bookmark.id);
      expect(result.archived_at).toBeNull();
    });

    it("should appear in findMany after unarchiving", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/unarchive-visible-${Date.now()}`,
        });
      });

      await archiveBookmark(bookmark.id);
      await unarchiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(ContextRepository.create());
      const allBookmarks = await repository.findMany();
      const found = allBookmarks.find((b) => b.id === bookmark.id);
      expect(found).toBeDefined();
      expect(found?.archived_at).toBeNull();
    });

    it("should not appear in findManyArchived after unarchiving", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/unarchive-hidden-${Date.now()}`,
        });
      });

      await archiveBookmark(bookmark.id);
      await unarchiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(ContextRepository.create());
      const archivedBookmarks = await repository.findManyArchived();
      const found = archivedBookmarks.find((b) => b.id === bookmark.id);
      expect(found).toBeUndefined();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";

      await expect(unarchiveBookmark(nonExistentId)).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
