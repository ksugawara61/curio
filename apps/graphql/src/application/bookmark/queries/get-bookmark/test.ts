import { describe, expect, it, vi } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { bookmark } from ".";

describe("bookmark", () => {
  describe("正常系", () => {
    it("should return bookmark when found by id", async () => {
      const createdBookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com/byid",
            description: "A test bookmark",
          });
        },
      );

      const result = await bookmark(createdBookmark.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBookmark.id);
      expect(result?.title).toBe(createdBookmark.title);
      expect(result?.url).toBe(createdBookmark.url);
      expect(result?.description).toBe(createdBookmark.description);
    });

    it("should return bookmark when found by uri", async () => {
      const testUri = "https://example.com/byuri";
      const createdBookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark by URI",
            url: testUri,
            description: "A test bookmark found by URI",
          });
        },
      );

      const result = await bookmark(undefined, testUri);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBookmark.id);
      expect(result?.title).toBe(createdBookmark.title);
      expect(result?.url).toBe(testUri);
      expect(result?.description).toBe(createdBookmark.description);
    });

    it("should return null when bookmark not found by id", async () => {
      const nonExistentId = "non-existent-id";

      const result = await bookmark(nonExistentId);

      expect(result).toBeNull();
    });

    it("should return null when bookmark not found by uri", async () => {
      const nonExistentUri = "https://non-existent.com";

      const result = await bookmark(undefined, nonExistentUri);

      expect(result).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw error when neither id nor uri is provided", async () => {
      await expect(bookmark()).rejects.toThrow(
        "Either id or uri must be provided",
      );
    });

    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findById: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(bookmark("some-id")).rejects.toThrow(
        "Failed to fetch bookmark: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(BookmarkRepository, "create").mockReturnValue({
        findById: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(bookmark("some-id")).rejects.toThrow(
        "Failed to fetch bookmark: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
