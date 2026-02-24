import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { archiveBookmark } from ".";

describe("archiveBookmark", () => {
  describe("正常系", () => {
    it("should archive a bookmark successfully", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/archive-test-${Date.now()}`,
          description: "A test bookmark",
        });
      });

      const result = await archiveBookmark(bookmark.id);

      expect(result.id).toBe(bookmark.id);
      expect(result.archived_at).toBeInstanceOf(Date);
      expect(result.archived_at).not.toBeNull();
    });

    it("should not appear in findMany after archiving", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/archive-hidden-${Date.now()}`,
        });
      });

      await archiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(ContextRepository.create());
      const allBookmarks = await repository.findMany();
      const found = allBookmarks.find((b) => b.id === bookmark.id);
      expect(found).toBeUndefined();
    });

    it("should appear in findManyArchived after archiving", async () => {
      const db = createDb();
      const bookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Test Bookmark",
          url: `https://example.com/archive-visible-${Date.now()}`,
        });
      });

      await archiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(ContextRepository.create());
      const archivedBookmarks = await repository.findManyArchived();
      const found = archivedBookmarks.find((b) => b.id === bookmark.id);
      expect(found).toBeDefined();
      expect(found?.archived_at).not.toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when bookmark does not exist", async () => {
      const nonExistentId = "non-existent-id";

      await expect(archiveBookmark(nonExistentId)).rejects.toThrowError(
        expect.objectContaining({
          message: "Bookmark not found",
        }),
      );
    });
  });
});
