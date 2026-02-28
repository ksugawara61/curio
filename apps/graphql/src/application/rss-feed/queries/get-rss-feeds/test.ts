import { describe, expect, it, vi } from "vitest";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { rssFeeds } from ".";

describe("rssFeeds", () => {
  const createTestFeed = async (url: string, title: string) => {
    return await DrizzleRepository.create().transaction(async (tx) => {
      const repository = new RssFeedRepository(ContextRepository.create(), tx);
      return await repository.create({ url, title });
    });
  };

  describe("正常系", () => {
    it("should return empty array when no feeds exist", async () => {
      const result = await rssFeeds();
      expect(result).toEqual([]);
    });

    it("should return all registered RSS feeds", async () => {
      await createTestFeed(
        `https://example.com/rss1-${Date.now()}.xml`,
        "Feed 1",
      );
      await createTestFeed(
        `https://example.com/rss2-${Date.now()}.xml`,
        "Feed 2",
      );

      const result = await rssFeeds();
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Feed 1");
      expect(result[1].title).toBe("Feed 2");
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(RssFeedRepository, "create").mockReturnValue({
        findAll: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(rssFeeds()).rejects.toThrow(
        "Failed to fetch RSS feeds: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(RssFeedRepository, "create").mockReturnValue({
        findAll: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(rssFeeds()).rejects.toThrow(
        "Failed to fetch RSS feeds: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
