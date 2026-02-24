import { describe, expect, it } from "vitest";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { rssFeeds } from ".";

describe("rssFeeds", () => {
  const createTestFeed = async (url: string, title: string) => {
    const db = createDb();
    return await db.transaction(async (tx) => {
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
});
