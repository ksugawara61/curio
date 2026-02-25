import { describe, expect, it } from "vitest";
import { articles } from "../../libs/drizzle/schema";
import { mockAuthContext } from "../../libs/test/authHelper";
import { ContextRepository } from "../../shared/context";
import { DrizzleRepository } from "../../shared/drizzle";
import { RssFeedRepository } from "../rss-feed/repository.persistence";
import { ArticlePersistenceRepository } from "./repository.persistence";

const setupFeed = async (userId: string, url: string) => {
  mockAuthContext({ userId });
  return await DrizzleRepository.create().transaction(async (tx) => {
    const feedRepo = new RssFeedRepository(ContextRepository.create(), tx);
    return await feedRepo.create({ url, title: "Test Feed" });
  });
};

describe("ArticlePersistenceRepository", () => {
  describe("upsert", () => {
    it("should insert a new article", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");

      const repo = new ArticlePersistenceRepository();
      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Test Article",
        url: "https://example.com/article-1",
        description: "A test article",
        thumbnail_url: "https://example.com/img.jpg",
        pub_date: "Mon, 01 Jan 2024 00:00:00 GMT",
      });

      const rows = await DrizzleRepository.create()
        .getDb()
        .select()
        .from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("Test Article");
      expect(rows[0].url).toBe("https://example.com/article-1");
      expect(rows[0].description).toBe("A test article");
      expect(rows[0].thumbnail_url).toBe("https://example.com/img.jpg");
      expect(rows[0].pub_date).toBe("Mon, 01 Jan 2024 00:00:00 GMT");
      expect(rows[0].user_id).toBe("test-user");
      expect(rows[0].rss_feed_id).toBe(feed.id);
    });

    it("should insert an article with only required fields", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");

      const repo = new ArticlePersistenceRepository();
      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Minimal Article",
        url: "https://example.com/minimal",
      });

      const rows = await DrizzleRepository.create()
        .getDb()
        .select()
        .from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("Minimal Article");
      expect(rows[0].description).toBeNull();
      expect(rows[0].thumbnail_url).toBeNull();
      expect(rows[0].pub_date).toBeNull();
    });

    it("should update an existing article on conflict (rss_feed_id + url)", async () => {
      const feed = await setupFeed("test-user", "https://example.com/feed.xml");
      const articleUrl = "https://example.com/article-update";

      const repo = new ArticlePersistenceRepository();
      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Original Title",
        url: articleUrl,
        description: "Original description",
      });

      await repo.upsert({
        user_id: "test-user",
        rss_feed_id: feed.id,
        title: "Updated Title",
        url: articleUrl,
        description: "Updated description",
        thumbnail_url: "https://example.com/new-thumb.jpg",
      });

      const rows = await DrizzleRepository.create()
        .getDb()
        .select()
        .from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("Updated Title");
      expect(rows[0].description).toBe("Updated description");
      expect(rows[0].thumbnail_url).toBe("https://example.com/new-thumb.jpg");
    });

    it("should allow same url under different rss_feed_id", async () => {
      const feed1 = await setupFeed("user-a", "https://example.com/feed1.xml");
      const feed2 = await setupFeed("user-b", "https://example.com/feed2.xml");
      const articleUrl = "https://example.com/shared-article";

      const repo = new ArticlePersistenceRepository();
      await repo.upsert({
        user_id: "user-a",
        rss_feed_id: feed1.id,
        title: "Article from Feed 1",
        url: articleUrl,
      });
      await repo.upsert({
        user_id: "user-b",
        rss_feed_id: feed2.id,
        title: "Article from Feed 2",
        url: articleUrl,
      });

      const rows = await DrizzleRepository.create()
        .getDb()
        .select()
        .from(articles);
      expect(rows).toHaveLength(2);
    });
  });
});
