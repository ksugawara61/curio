import { describe, expect, it } from "vitest";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { GetBookmarks } from ".";

describe("GetBookmarks", () => {
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

      const repository = new BookmarkRepository(ContextRepository.create());
      const result = await new GetBookmarks(repository).invoke();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("url");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");
    });

    it("should return empty array when no bookmarks exist", async () => {
      const repository = new BookmarkRepository(ContextRepository.create());
      const result = await new GetBookmarks(repository).invoke();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
