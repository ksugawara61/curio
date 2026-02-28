import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { archiveBookmark } from ".";

describe("archiveBookmark", () => {
  describe("正常系", () => {
    it("should archive a bookmark successfully", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: `https://example.com/archive-test-${Date.now()}`,
            description: "A test bookmark",
          });
        },
      );

      const result = await archiveBookmark(bookmark.id);

      expect(result.id).toBe(bookmark.id);
      expect(result.archived_at).toBeInstanceOf(Date);
      expect(result.archived_at).not.toBeNull();
    });

    it("should not appear in findMany after archiving", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: `https://example.com/archive-hidden-${Date.now()}`,
          });
        },
      );

      await archiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const allBookmarks = await repository.findMany();
      const found = allBookmarks.find((b) => b.id === bookmark.id);
      expect(found).toBeUndefined();
    });

    it("should appear in findManyArchived after archiving", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: `https://example.com/archive-visible-${Date.now()}`,
          });
        },
      );

      await archiveBookmark(bookmark.id);

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
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

    it("should throw ServiceError when repository throws an unexpected Error", async () => {
      vi.spyOn(BookmarkRepository.prototype, "archive").mockRejectedValue(
        new Error("Unexpected DB error"),
      );
      await expect(archiveBookmark("some-id")).rejects.toThrow(
        "Failed to archive bookmark: Unexpected DB error",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(BookmarkRepository.prototype, "archive").mockRejectedValue(
        "non-error string",
      );
      await expect(archiveBookmark("some-id")).rejects.toThrow(
        "Failed to archive bookmark: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
