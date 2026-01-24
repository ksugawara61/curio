import { describe, expect, it } from "vitest";
import { createDb } from "../../../libs/drizzle/client";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";
import { bookmarks } from ".";

describe("bookmarks", () => {
  describe("正常系", () => {
    it("should return array of bookmarks", async () => {
      const db = createDb();
      await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
        return await repository.create({
          title: "Test Bookmark 1",
          url: "https://example1.com",
          description: "First test bookmark",
        });
      });

      await db.transaction(async (tx) => {
        const repository = new BookmarkRepository(tx);
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
});
