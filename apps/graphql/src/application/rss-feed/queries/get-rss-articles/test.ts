import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { mockServer } from "../../../../libs/test/mockServer";
import { ContextRepository } from "../../../../shared/context";
import { rssArticles } from ".";

const createTestFeed = async (url: string, title: string) => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();

  return await db.transaction(async (tx) => {
    const repository = new RssFeedRepository(userId, tx);
    return await repository.create({ url, title });
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

describe("rssArticles", () => {
  describe("正常系", () => {
    it("should return articles from an RSS feed", async () => {
      const feed = await createTestFeed(
        "https://example.com/rss.xml",
        "Test Feed",
      );

      mockServer.use(
        http.get("https://example.com/rss.xml", () => HttpResponse.xml(rssXml)),
      );

      const result = await rssArticles(feed.id);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        title: "Article 1",
        link: "https://example.com/1",
        description: "Description 1",
        pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
      });
      expect(result[1].title).toBe("Article 2");
    });
  });

  describe("異常系", () => {
    it("should throw NOT_FOUND when feed does not exist", async () => {
      await expect(rssArticles("non-existent-id")).rejects.toThrow(
        "RSS feed not found",
      );
    });

    it("should throw INTERNAL_ERROR when feed fetch fails", async () => {
      const feed = await createTestFeed(
        "https://example.com/broken.xml",
        "Broken Feed",
      );

      mockServer.use(
        http.get(
          "https://example.com/broken.xml",
          () => new HttpResponse(null, { status: 500 }),
        ),
      );

      await expect(rssArticles(feed.id)).rejects.toThrow(
        "Failed to fetch RSS articles",
      );
    });
  });
});
