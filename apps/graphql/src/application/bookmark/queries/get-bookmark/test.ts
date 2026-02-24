import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { bookmark } from ".";

describe("bookmark", () => {
  describe("正常系", () => {
    it("should return bookmark when found by id", async () => {
      const db = createDb();
      const createdBookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark",
          url: "https://example.com/byid",
          description: "A test bookmark",
        });
      });

      const result = await bookmark(createdBookmark.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBookmark.id);
      expect(result?.title).toBe(createdBookmark.title);
      expect(result?.url).toBe(createdBookmark.url);
      expect(result?.description).toBe(createdBookmark.description);
    });

    it("should return bookmark when found by uri", async () => {
      const db = createDb();
      const testUri = "https://example.com/byuri";
      const createdBookmark = await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(ContextRepository.create(), tx);
        return await repository.create({
          title: "Test Bookmark by URI",
          url: testUri,
          description: "A test bookmark found by URI",
        });
      });

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
  });
});
