import { describe, expect, it } from "vitest";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { mockAuthContext } from "../../../../libs/test/authHelper";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { GetRecentArticles } from ".";

const setupFeed = async (userId: string, url: string) => {
  mockAuthContext({ userId });
  return await DrizzleRepository.create().transaction(async (tx) => {
    const feedRepo = new RssFeedRepository(ContextRepository.create(), tx);
    return await feedRepo.create({ url, title: "Test Feed" });
  });
};

describe("GetRecentArticles", () => {
  describe("正常系", () => {
    it("should return articles with pub_date within the specified hours", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      const recentPubDate = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      ).toISOString(); // 24 hours ago

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Recent Article",
        url: "https://example.com/recent",
        description: "A recent article",
        pub_date: recentPubDate,
      });

      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
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

    it("should exclude articles with pub_date older than the specified hours", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      const oldPubDate = new Date(
        Date.now() - 72 * 60 * 60 * 1000,
      ).toISOString(); // 72 hours ago

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Old Article",
        url: "https://example.com/old",
        pub_date: oldPubDate,
      });

      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
        hours: 48,
      });

      expect(result).toHaveLength(0);
    });

    it("should fall back to created_at when pub_date is null", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "No PubDate Article",
        url: "https://example.com/no-pubdate",
        pub_date: null,
      });

      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
        hours: 48,
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("No PubDate Article");
    });

    it("should return empty array when no articles exist", async () => {
      const repo = new ArticlePersistenceRepository();
      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
        hours: 48,
      });

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should only return articles for the authenticated user", async () => {
      const feed1 = await setupFeed("user-a", "https://example.com/feed1.xml");
      const feed2 = await setupFeed("user-b", "https://example.com/feed2.xml");
      const repo = new ArticlePersistenceRepository();

      const recentPubDate = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      ).toISOString();

      await repo.upsert({
        user_id: "user-a",
        rss_feed_id: feed1.id,
        title: "User A Article",
        url: "https://example.com/article-a",
        pub_date: recentPubDate,
      });
      await repo.upsert({
        user_id: "user-b",
        rss_feed_id: feed2.id,
        title: "User B Article",
        url: "https://example.com/article-b",
        pub_date: recentPubDate,
      });

      mockAuthContext({ userId: "user-a" });
      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
        hours: 48,
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("User A Article");
      expect(result[0].user_id).toBe("user-a");
    });

    it("should support RFC 2822 pub_date format from RSS feeds", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const repo = new ArticlePersistenceRepository();

      // RFC 2822 format used by RSS feeds
      const recentRfc2822 = new Date(
        Date.now() - 24 * 60 * 60 * 1000,
      ).toUTCString();

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "RSS Article",
        url: "https://example.com/rss-article",
        pub_date: recentRfc2822,
      });

      const result = await new GetRecentArticles(
        repo,
        ContextRepository.create(),
      ).invoke({
        hours: 48,
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("RSS Article");
    });
  });
});
