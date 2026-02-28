import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { bookmarks } from ".";

describe("bookmarks", () => {
  describe("正常系", () => {
    it("should return array of bookmarks", async () => {
      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Test Bookmark 1",
          url: "https://example1.com",
          description: "First test bookmark",
        });
      });

      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        return await repository.create({
          title: "Test Bookmark 2",
          url: "https://example2.com",
          description: undefined,
        });
      });

      const result = await bookmarks();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("url");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");
    });

    it("should return empty array when no bookmarks exist", async () => {
      const result = await bookmarks();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findMany: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(bookmarks()).rejects.toThrow(
        "Failed to fetch bookmarks: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findMany: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(bookmarks()).rejects.toThrow(
        "Failed to fetch bookmarks: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
