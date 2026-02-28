import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { mockAuthContext } from "../../../../libs/test/authHelper";
import { mockServer } from "../../../../libs/test/mockServer";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { articles } from ".";
import { ArticleMocks } from "./mocks";

// ---- helpers ----

const setupFeed = async (userId: string, url: string) => {
  mockAuthContext({ userId });
  return await DrizzleRepository.create().transaction(async (tx) => {
    const feedRepo = new RssFeedRepository(ContextRepository.create(), tx);
    return await feedRepo.create({ url, title: "Test Feed" });
  });
};

const rssXml = `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>Article 1</title>
      <link>https://example.com/1</link>
      <description>Description 1</description>
      <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Article 2</title>
      <link>https://example.com/2</link>
    </item>
  </channel>
</rss>
`;

// ---- qiita source ----

describe("articles (source: qiita)", () => {
  it("should return articles from Qiita", async () => {
    mockServer.use(...ArticleMocks.Success);

    const result = await articles({ source: "qiita", offset: 0, limit: 20 });

    expect(result.length).toBeGreaterThan(0);
    for (const article of result) {
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("url");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("tags");
      expect(article).toHaveProperty("created_at");
      expect(article).toHaveProperty("updated_at");
      expect(article.source).toBe("qiita");
    }
  });
});

// ---- database source ----

describe("articles (source: database)", () => {
  it("should return articles within the specified hours", async () => {
    const feed = await setupFeed("test-user", "https://example.com/feed.xml");
    const repo = new ArticlePersistenceRepository(
      ContextRepository.create(),
      DrizzleRepository.create().getDb(),
    );

    const recentPubDate = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    await repo.upsert({
      rss_feed_id: feed.id,
      title: "Recent Article",
      url: "https://example.com/recent",
      description: "A recent article",
      pub_date: recentPubDate,
    });

    const result = await articles({ source: "database", hours: 48 });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Recent Article",
      url: "https://example.com/recent",
      source: "database",
    });
    expect(typeof result[0].created_at).toBe("string");
    expect(typeof result[0].updated_at).toBe("string");
  });

  it("should exclude articles older than the specified hours", async () => {
    const feed = await setupFeed("test-user", "https://example.com/feed.xml");
    const repo = new ArticlePersistenceRepository(
      ContextRepository.create(),
      DrizzleRepository.create().getDb(),
    );

    const oldPubDate = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    await repo.upsert({
      rss_feed_id: feed.id,
      title: "Old Article",
      url: "https://example.com/old",
      pub_date: oldPubDate,
    });

    const result = await articles({ source: "database", hours: 48 });

    expect(result).toHaveLength(0);
  });

  it("should only return articles for the authenticated user", async () => {
    const feed1 = await setupFeed("user-a", "https://example.com/feed1.xml");
    const feed2 = await setupFeed("user-b", "https://example.com/feed2.xml");
    const repo = new ArticlePersistenceRepository(
      ContextRepository.create(),
      DrizzleRepository.create().getDb(),
    );

    const recentPubDate = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    await repo.upsert({
      rss_feed_id: feed1.id,
      title: "User A Article",
      url: "https://example.com/article-a",
      pub_date: recentPubDate,
    });
    await repo.upsert({
      rss_feed_id: feed2.id,
      title: "User B Article",
      url: "https://example.com/article-b",
      pub_date: recentPubDate,
    });

    mockAuthContext({ userId: "user-a" });
    const result = await articles({ source: "database", hours: 48 });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("User A Article");
  });

  it("should include read_at when article has been marked as read", async () => {
    const feed = await setupFeed("test-user", "https://example.com/feed.xml");
    const repo = new ArticlePersistenceRepository(
      ContextRepository.create(),
      DrizzleRepository.create().getDb(),
    );

    const recentPubDate = new Date(
      Date.now() - 24 * 60 * 60 * 1000,
    ).toISOString();

    await repo.upsert({
      rss_feed_id: feed.id,
      title: "Read Article",
      url: `https://example.com/read-article-${Date.now()}`,
      pub_date: recentPubDate,
    });

    const allArticles = await articles({ source: "database", hours: 48 });
    const readArticle = allArticles.find((a) => a.title === "Read Article");
    expect(readArticle).toBeDefined();

    if (readArticle?.id) {
      await repo.markAsRead(readArticle.id);
    }

    const result = await articles({ source: "database", hours: 48 });
    const markedArticle = result.find((a) => a.title === "Read Article");
    expect(markedArticle).toBeDefined();
    expect(markedArticle?.read_at).not.toBeNull();
  });
});

// ---- rss source ----

describe("articles (source: rss)", () => {
  it("should return articles from an RSS feed", async () => {
    const feed = await setupFeed("test-user", "https://example.com/rss.xml");

    mockServer.use(
      http.get("https://example.com/rss.xml", () => HttpResponse.xml(rssXml)),
    );

    const result = await articles({ source: "rss", feedId: feed.id });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      title: "Article 1",
      url: "https://example.com/1",
      description: "Description 1",
      pub_date: "Mon, 01 Jan 2024 00:00:00 GMT",
      source: "rss",
    });
    expect(result[1].title).toBe("Article 2");
  });

  it("should throw BAD_REQUEST when feedId is missing", async () => {
    await expect(articles({ source: "rss" })).rejects.toThrow(
      "feedId is required when source is rss",
    );
  });

  it("should throw NOT_FOUND when feed does not exist", async () => {
    await expect(
      articles({ source: "rss", feedId: "non-existent-id" }),
    ).rejects.toThrow("RSS feed not found");
  });
});
