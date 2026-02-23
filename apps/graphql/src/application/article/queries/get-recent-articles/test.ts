import { describe, expect, it } from "vitest";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { GetRecentArticles } from ".";

const setupFeed = async (userId: string, url: string) => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    const feedRepo = new RssFeedRepository(userId, tx);
    return await feedRepo.create({ url, title: "Test Feed" });
  });
};

describe("GetRecentArticles", () => {
  describe("正常系", () => {
    it("should return articles created within the specified hours", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Recent Article",
        url: "https://example.com/recent",
        description: "A recent article",
      });

      const result = await new GetRecentArticles(repo, "test-user").invoke({
        hours: 48,
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title", "Recent Article");
      expect(result[0]).toHaveProperty("url", "https://example.com/recent");
      expect(result[0]).toHaveProperty("user_id", "test-user");
      expect(result[0]).toHaveProperty("rss_feed_id", feed.id);
      expect(result[0].created_at).toBeInstanceOf(Date);
      expect(result[0].updated_at).toBeInstanceOf(Date);
    });

    it("should return empty array when no articles exist", async () => {
      const repo = new ArticlePersistenceRepository();
      const result = await new GetRecentArticles(repo, "test-user").invoke({
        hours: 48,
      });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should only return articles for the authenticated user", async () => {
      const feed1 = await setupFeed("user-a", "https://example.com/feed1.xml");
      const feed2 = await setupFeed("user-b", "https://example.com/feed2.xml");
      const repo = new ArticlePersistenceRepository();

      await repo.upsert({
        user_id: "user-a",
        rss_feed_id: feed1.id,
        title: "User A Article",
        url: "https://example.com/article-a",
      });
      await repo.upsert({
        user_id: "user-b",
        rss_feed_id: feed2.id,
        title: "User B Article",
        url: "https://example.com/article-b",
      });

      const result = await new GetRecentArticles(repo, "user-a").invoke({
        hours: 48,
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("User A Article");
      expect(result[0].user_id).toBe("user-a");
    });

    it("should support custom hours input for flexible time ranges", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Article within 1 hour",
        url: "https://example.com/article-1h",
      });

      const result = await new GetRecentArticles(repo, "test-user").invoke({
        hours: 1,
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Article within 1 hour");
    });
  });
});
