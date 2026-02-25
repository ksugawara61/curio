import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { articles } from "../../../../libs/drizzle/schema";
import { mockServer } from "../../../../libs/test/mockServer";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { createRssFeed } from ".";

vi.mock("./validate", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./validate")>();
  return {
    ...actual,
    fetchAndValidateRssFeed: vi.fn(),
  };
});

import { fetchAndValidateRssFeed } from "./validate";

const mockFetchAndValidate = vi.mocked(fetchAndValidateRssFeed);

const createRssXml = (
  items: {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
    thumbnail?: string;
  }[],
) => `<?xml version="1.0" encoding="UTF-8"?>
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
</rss>`;

const EMPTY_RSS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Feed</title>
  </channel>
</rss>`;

describe("createRssFeed", () => {
  describe("正常系", () => {
    it("should create an RSS feed successfully", async () => {
      mockFetchAndValidate.mockResolvedValue({
        title: "Test Blog",
        description: "A test blog feed",
      });
      mockServer.use(
        http.get("https://example.com/rss.xml", () =>
          HttpResponse.xml(EMPTY_RSS_XML),
        ),
      );

      const result = await createRssFeed("https://example.com/rss.xml");

      expect(result).toHaveProperty("id");
      expect(result.url).toBe("https://example.com/rss.xml");
      expect(result.title).toBe("Test Blog");
      expect(result.description).toBe("A test blog feed");
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create an RSS feed without description", async () => {
      mockFetchAndValidate.mockResolvedValue({
        title: "No Desc Blog",
      });
      const url = `https://example.com/rss-${Date.now()}.xml`;
      mockServer.use(http.get(url, () => HttpResponse.xml(EMPTY_RSS_XML)));

      const result = await createRssFeed(url);

      expect(result.title).toBe("No Desc Blog");
      expect(result.description).toBeNull();
    });

    it("should save initial articles when creating a feed", async () => {
      mockFetchAndValidate.mockResolvedValue({
        title: "Test Blog",
        description: "A test blog feed",
      });
      mockServer.use(
        http.get("https://example.com/rss.xml", () =>
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

      const feed = await createRssFeed("https://example.com/rss.xml");

      const db = DrizzleRepository.create().getDb();
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

    it("should skip articles without a link when saving initial articles", async () => {
      mockFetchAndValidate.mockResolvedValue({ title: "Test Blog" });
      mockServer.use(
        http.get("https://example.com/rss.xml", () =>
          HttpResponse.xml(`<?xml version="1.0" encoding="UTF-8"?>
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
</rss>`),
        ),
      );

      await createRssFeed("https://example.com/rss.xml");

      const db = DrizzleRepository.create().getDb();
      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(1);
      expect(rows[0].url).toBe("https://example.com/has-link");
    });

    it("should create feed successfully even if initial article fetching fails", async () => {
      mockFetchAndValidate.mockResolvedValue({ title: "Test Blog" });
      mockServer.use(
        http.get(
          "https://example.com/rss.xml",
          () => new HttpResponse(null, { status: 500 }),
        ),
      );

      const result = await createRssFeed("https://example.com/rss.xml");

      expect(result).toHaveProperty("id");
      expect(result.url).toBe("https://example.com/rss.xml");

      const db = DrizzleRepository.create().getDb();
      const rows = await db.select().from(articles);
      expect(rows).toHaveLength(0);
    });
  });

  describe("異常系", () => {
    it("should throw on invalid URL format", async () => {
      await expect(createRssFeed("not-a-url")).rejects.toThrow(
        "Invalid URL format",
      );
    });

    it("should throw on invalid RSS URL", async () => {
      mockFetchAndValidate.mockRejectedValue(
        new Error("The URL does not point to a valid RSS or Atom feed"),
      );

      await expect(
        createRssFeed("https://example.com/not-rss"),
      ).rejects.toThrow("Invalid RSS feed URL");
    });

    it("should throw on duplicate URL registration", async () => {
      mockFetchAndValidate.mockResolvedValue({
        title: "Duplicate Blog",
      });
      const url = `https://example.com/rss-dup-${Date.now()}.xml`;
      mockServer.use(http.get(url, () => HttpResponse.xml(EMPTY_RSS_XML)));

      await createRssFeed(url);

      await expect(createRssFeed(url)).rejects.toThrow("is already registered");
    });
  });
});
