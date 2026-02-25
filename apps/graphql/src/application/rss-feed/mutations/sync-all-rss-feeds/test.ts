import { describe, expect, it } from "vitest";
import { articles } from "../../../../domain/article/schema";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { mockAuthContext } from "../../../../libs/test/authHelper";
import { mockServer } from "../../../../libs/test/mockServer";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { syncAllRssFeeds } from ".";
import { SyncAllRssFeedsMocks } from "./mocks";

describe("syncAllRssFeeds", () => {
  describe("正常系", () => {
    it("should do nothing when no feeds are registered", async () => {
      await syncAllRssFeeds();

      const db = DrizzleRepository.create().getDb();
      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(0);
    });

    it("should fetch articles and upsert them for each feed", async () => {
      const db = DrizzleRepository.create().getDb();

      const feed = await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(SyncAllRssFeedsMocks.FeedWithTwoArticles);

      await syncAllRssFeeds();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(2);

      const article1 = rows.find(
        (r) => r.url === "https://example.com/article-1",
      );
      expect(article1).toBeDefined();
      expect(article1?.title).toBe("Article 1");
      expect(article1?.description).toBe("Description 1");
      expect(article1?.pub_date).toBe("Mon, 01 Jan 2024 00:00:00 GMT");
      expect(article1?.thumbnail_url).toBe("https://example.com/img1.jpg");
      expect(article1?.user_id).toBe("test-user");
      expect(article1?.rss_feed_id).toBe(feed.id);

      const article2 = rows.find(
        (r) => r.url === "https://example.com/article-2",
      );
      expect(article2).toBeDefined();
      expect(article2?.title).toBe("Article 2");
    });

    it("should process feeds for multiple users independently", async () => {
      const db = DrizzleRepository.create().getDb();

      mockAuthContext({ userId: "user-a" });
      await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed-a.xml",
          title: "Feed A",
        });
      });

      mockAuthContext({ userId: "user-b" });
      await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed-b.xml",
          title: "Feed B",
        });
      });

      mockServer.use(SyncAllRssFeedsMocks.FeedA, SyncAllRssFeedsMocks.FeedB);

      await syncAllRssFeeds();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(2);

      const userIds = rows.map((r) => r.user_id).sort();
      expect(userIds).toEqual(["user-a", "user-b"]);
    });

    it("should upsert articles on repeated runs (update existing)", async () => {
      const db = DrizzleRepository.create().getDb();

      await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(SyncAllRssFeedsMocks.FeedWithOriginalArticle);

      await syncAllRssFeeds();

      mockServer.use(SyncAllRssFeedsMocks.FeedWithUpdatedArticle);

      await syncAllRssFeeds();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("Updated Title");
      expect(rows[0].description).toBe("Updated description");
    });

    it("should skip articles without a link", async () => {
      const db = DrizzleRepository.create().getDb();

      await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(SyncAllRssFeedsMocks.FeedWithMissingLink);

      await syncAllRssFeeds();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].url).toBe("https://example.com/has-link");
    });
  });

  describe("異常系", () => {
    it("should continue processing other feeds when one fails", async () => {
      const db = DrizzleRepository.create().getDb();

      await DrizzleRepository.create().transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/failing-feed.xml",
          title: "Failing Feed",
        });
        await repo.create({
          url: "https://example.com/ok-feed.xml",
          title: "OK Feed",
        });
      });

      mockServer.use(
        SyncAllRssFeedsMocks.FailingFeed,
        SyncAllRssFeedsMocks.OkFeed,
      );

      await syncAllRssFeeds();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].url).toBe("https://example.com/ok-article");
    });
  });
});
