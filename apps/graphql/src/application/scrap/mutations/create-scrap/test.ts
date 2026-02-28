import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { createScrap } from ".";

describe("createScrap", () => {
  describe("正常系", () => {
    it("should create a scrap with title and content", async () => {
      const input = {
        title: "My First Scrap",
        content: "# Hello\n\nThis is **Markdown** content.",
      };

      const result = await createScrap(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.content).toBe(input.content);
      expect(result.bookmarks).toEqual([]);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create a scrap with associated bookmarks", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Related Bookmark",
            url: `https://example.com/scrap-bookmark-${Date.now()}`,
          });
        },
      );

      const input = {
        title: "Scrap with Bookmarks",
        content: "## References\n\nSee linked bookmark.",
        bookmarkIds: [bookmark.id],
      };

      const result = await createScrap(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.content).toBe(input.content);
      expect(result.bookmarks).toHaveLength(1);
      expect(result.bookmarks?.[0].id).toBe(bookmark.id);
      expect(result.bookmarks?.[0].title).toBe(bookmark.title);
    });

    it("should create a scrap with multiple bookmarks", async () => {
      const now = Date.now();
      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark A",
            url: `https://example.com/scrap-multi-a-${now}`,
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
            url: `https://example.com/scrap-multi-b-${now}`,
          });
        },
      );

      const result = await createScrap({
        title: "Multi-bookmark Scrap",
        content: "Content referencing multiple bookmarks.",
        bookmarkIds: [bookmarkA.id, bookmarkB.id],
      });

      expect(result.bookmarks).toHaveLength(2);
      const ids = result.bookmarks?.map((b) => b.id);
      expect(ids).toContain(bookmarkA.id);
      expect(ids).toContain(bookmarkB.id);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(ScrapRepository.prototype, "create").mockRejectedValue(
        new Error("DB connection failed"),
      );
      await expect(
        createScrap({ title: "Test", content: "Content" }),
      ).rejects.toThrow("Failed to create scrap: DB connection failed");
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(ScrapRepository.prototype, "create").mockRejectedValue(
        "non-error string",
      );
      await expect(
        createScrap({ title: "Test", content: "Content" }),
      ).rejects.toThrow("Failed to create scrap: Unknown error");
      vi.restoreAllMocks();
    });
  });
});
