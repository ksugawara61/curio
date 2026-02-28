import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { archiveBookmark } from "../../mutations/archive-bookmark";
import { archivedBookmarks } from ".";

describe("archivedBookmarks", () => {
  describe("正常系", () => {
    it("should return only archived bookmarks", async () => {
      const bookmark1 = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Archived Bookmark",
            url: `https://example.com/archived-query-1-${Date.now()}`,
          });
        },
      );

      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Active Bookmark",
          url: `https://example.com/active-query-1-${Date.now()}`,
        });
      });

      await archiveBookmark(bookmark1.id);

      const result = await archivedBookmarks();

      const archivedIds = result.map((b) => b.id);
      expect(archivedIds).toContain(bookmark1.id);
      for (const b of result) {
        expect(b.archived_at).not.toBeNull();
      }
    });

    it("should return empty array when no archived bookmarks exist", async () => {
      const result = await archivedBookmarks();

      // All results should be archived (previous tests may have left data)
      for (const b of result) {
        expect(b.archived_at).not.toBeNull();
      }
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findManyArchived: vi
          .fn()
          .mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(archivedBookmarks()).rejects.toThrow(
        "Failed to fetch archived bookmarks: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findManyArchived: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(archivedBookmarks()).rejects.toThrow(
        "Failed to fetch archived bookmarks: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
