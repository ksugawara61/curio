import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { RssFeedRepository } from "../domain/rss-feed/repository.persistence";
import { createDb } from "../libs/drizzle/client";
import { articles } from "../libs/drizzle/schema";
import { mockServer } from "../libs/test/mockServer";
import { scheduled } from "./index";

const createRssXml = (
  items: {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
    thumbnail?: string;
  }[],
) => `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Test Feed</title>
    <description>A test feed</description>
    ${items
      .map(
        (item) => `
    <item>
      <title>${item.title}</title>
      <link>${item.link}</link>
      ${item.description ? `<description>${item.description}</description>` : ""}
      ${item.pubDate ? `<pubDate>${item.pubDate}</pubDate>` : ""}
      ${item.thumbnail ? `<media:thumbnail url="${item.thumbnail}"/>` : ""}
    </item>`,
      )
      .join("")}
  </channel>
</rss>
`;

describe("scheduled", () => {
  describe("正常系", () => {
    it("should do nothing when no feeds are registered", async () => {
      await scheduled();

      const db = createDb();
      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(0);
    });

    it("should fetch articles and upsert them for each feed", async () => {
      const db = createDb();

      const feed = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(
        http.get("https://example.com/feed.xml", () =>
          HttpResponse.xml(
            createRssXml([
              {
                title: "Article 1",
                link: "https://example.com/article-1",
                description: "Description 1",
                pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
                thumbnail: "https://example.com/img1.jpg",
              },
              {
                title: "Article 2",
                link: "https://example.com/article-2",
                description: "Description 2",
              },
            ]),
          ),
        ),
      );

      await scheduled();

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
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("user-a", tx);
        await repo.create({
          url: "https://example.com/feed-a.xml",
          title: "Feed A",
        });
      });

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("user-b", tx);
        await repo.create({
          url: "https://example.com/feed-b.xml",
          title: "Feed B",
        });
      });

      mockServer.use(
        http.get("https://example.com/feed-a.xml", () =>
          HttpResponse.xml(
            createRssXml([
              { title: "A Article", link: "https://example.com/a-article" },
            ]),
          ),
        ),
        http.get("https://example.com/feed-b.xml", () =>
          HttpResponse.xml(
            createRssXml([
              { title: "B Article", link: "https://example.com/b-article" },
            ]),
          ),
        ),
      );

      await scheduled();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(2);

      const userIds = rows.map((r) => r.user_id).sort();
      expect(userIds).toEqual(["user-a", "user-b"]);
    });

    it("should upsert articles on repeated runs (update existing)", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(
        http.get("https://example.com/feed.xml", () =>
          HttpResponse.xml(
            createRssXml([
              {
                title: "Original Title",
                link: "https://example.com/article",
                description: "Original description",
              },
            ]),
          ),
        ),
      );

      await scheduled();

      mockServer.use(
        http.get("https://example.com/feed.xml", () =>
          HttpResponse.xml(
            createRssXml([
              {
                title: "Updated Title",
                link: "https://example.com/article",
                description: "Updated description",
              },
            ]),
          ),
        ),
      );

      await scheduled();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].title).toBe("Updated Title");
      expect(rows[0].description).toBe("Updated description");
    });

    it("should skip articles without a link", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      mockServer.use(
        http.get("https://example.com/feed.xml", () =>
          HttpResponse.xml(`
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
    <item>
      <title>No Link Article</title>
    </item>
    <item>
      <title>Has Link Article</title>
      <link>https://example.com/has-link</link>
    </item>
  </channel>
</rss>
          `),
        ),
      );

      await scheduled();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].url).toBe("https://example.com/has-link");
    });
  });

  describe("異常系", () => {
    it("should continue processing other feeds when one fails", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
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
        http.get(
          "https://example.com/failing-feed.xml",
          () => new HttpResponse(null, { status: 500 }),
        ),
        http.get("https://example.com/ok-feed.xml", () =>
          HttpResponse.xml(
            createRssXml([
              { title: "OK Article", link: "https://example.com/ok-article" },
            ]),
          ),
        ),
      );

      await scheduled();

      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].url).toBe("https://example.com/ok-article");
    });
  });
});
