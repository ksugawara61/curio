import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { updateScrap } from ".";

describe("updateScrap", () => {
  describe("正常系", () => {
    it("should update scrap title", async () => {
      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Original Title",
            content: "Original content.",
          },
        );
      });

      const result = await updateScrap(scrap.id, { title: "Updated Title" });

      expect(result.id).toBe(scrap.id);
      expect(result.title).toBe("Updated Title");
      expect(result.content).toBe(scrap.content);
      expect(result.updated_at.getTime()).toBeGreaterThan(
        result.created_at.getTime(),
      );
    });

    it("should update scrap content", async () => {
      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Title",
            content: "# Old content",
          },
        );
      });

      const result = await updateScrap(scrap.id, {
        content: "# Updated\n\nNew Markdown content.",
      });

      expect(result.id).toBe(scrap.id);
      expect(result.title).toBe(scrap.title);
      expect(result.content).toBe("# Updated\n\nNew Markdown content.");
    });

    it("should replace associated bookmarks when bookmarkIds is specified", async () => {
      const now = Date.now();
      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark A",
            url: `https://example.com/upd-scrap-a-${now}`,
          });
        },
      );
      const bookmarkB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark B",
            url: `https://example.com/upd-scrap-b-${now}`,
          });
        },
      );

      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap",
            content: "Content.",
            bookmarkIds: [bookmarkA.id],
          },
        );
      });

      // Replace bookmarkA with bookmarkB
      const result = await updateScrap(scrap.id, {
        bookmarkIds: [bookmarkB.id],
      });

      expect(result.bookmarks).toHaveLength(1);
      expect(result.bookmarks?.[0].id).toBe(bookmarkB.id);
    });

    it("should clear associated bookmarks when bookmarkIds is empty array", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark",
            url: `https://example.com/upd-scrap-clear-${Date.now()}`,
          });
        },
      );

      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap",
            content: "Content.",
            bookmarkIds: [bookmark.id],
          },
        );
      });

      const result = await updateScrap(scrap.id, { bookmarkIds: [] });

      expect(result.bookmarks).toHaveLength(0);
    });

    it("should preserve existing bookmarks when bookmarkIds is not specified", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark",
            url: `https://example.com/upd-scrap-preserve-${Date.now()}`,
          });
        },
      );

      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap",
            content: "Content.",
            bookmarkIds: [bookmark.id],
          },
        );
      });

      const result = await updateScrap(scrap.id, { title: "Updated Title" });

      expect(result.bookmarks).toHaveLength(1);
      expect(result.bookmarks?.[0].id).toBe(bookmark.id);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when scrap does not exist", async () => {
      await expect(
        updateScrap("non-existent-id", { title: "Updated" }),
      ).rejects.toThrowError(
        expect.objectContaining({
          message: "Scrap not found",
        }),
      );
    });

    it("should throw ServiceError when repository throws an unexpected Error", async () => {
      vi.spyOn(ScrapRepository.prototype, "update").mockRejectedValue(
        new Error("Unexpected DB error"),
      );
      await expect(
        updateScrap("some-id", { title: "Updated" }),
      ).rejects.toThrow("Failed to update scrap: Unexpected DB error");
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(ScrapRepository.prototype, "update").mockRejectedValue(
        "non-error string",
      );
      await expect(
        updateScrap("some-id", { title: "Updated" }),
      ).rejects.toThrow("Failed to update scrap: Unknown error");
      vi.restoreAllMocks();
    });
  });
});
