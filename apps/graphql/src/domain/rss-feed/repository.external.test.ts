import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { mockServer } from "../../libs/test/mockServer";
import { RssFeedExternalRepository } from "./repository.external";

const createRssXml = (
  items: {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
  }[],
) => `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
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
    </item>`,
      )
      .join("")}
  </channel>
</rss>
`;

const createAtomXml = (
  entries: {
    title: string;
    link: string;
    summary?: string;
    published?: string;
  }[],
) => `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Test Atom Feed</title>
  ${entries
    .map(
      (entry) => `
  <entry>
    <title>${entry.title}</title>
    <link href="${entry.link}"/>
    ${entry.summary ? `<summary>${entry.summary}</summary>` : ""}
    ${entry.published ? `<published>${entry.published}</published>` : ""}
  </entry>`,
    )
    .join("")}
</feed>
`;

describe("RssFeedExternalRepository", () => {
  const repository = new RssFeedExternalRepository();

  describe("正常系", () => {
    it("should parse RSS 2.0 items", async () => {
      mockServer.use(
        http.get("https://example.com/rss.xml", () =>
          HttpResponse.xml(
            createRssXml([
              {
                title: "Article 1",
                link: "https://example.com/1",
                description: "Description 1",
                pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
              },
              {
                title: "Article 2",
                link: "https://example.com/2",
                description: "Description 2",
                pubDate: "Tue, 02 Jan 2024 00:00:00 GMT",
              },
            ]),
          ),
        ),
      );

      const articles = await repository.fetchArticles(
        "https://example.com/rss.xml",
      );

      expect(articles).toHaveLength(2);
      expect(articles[0]).toEqual({
        title: "Article 1",
        link: "https://example.com/1",
        description: "Description 1",
        pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
      });
      expect(articles[1]).toEqual({
        title: "Article 2",
        link: "https://example.com/2",
        description: "Description 2",
        pubDate: "Tue, 02 Jan 2024 00:00:00 GMT",
      });
    });

    it("should parse Atom entries", async () => {
      mockServer.use(
        http.get("https://example.com/atom.xml", () =>
          HttpResponse.xml(
            createAtomXml([
              {
                title: "Entry 1",
                link: "https://example.com/entry/1",
                summary: "Summary 1",
                published: "2024-01-01T00:00:00Z",
              },
            ]),
          ),
        ),
      );

      const articles = await repository.fetchArticles(
        "https://example.com/atom.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0]).toEqual({
        title: "Entry 1",
        link: "https://example.com/entry/1",
        description: "Summary 1",
        pubDate: "2024-01-01T00:00:00Z",
      });
    });

    it("should handle items without optional fields", async () => {
      mockServer.use(
        http.get("https://example.com/minimal.xml", () =>
          HttpResponse.xml(
            createRssXml([
              {
                title: "Minimal Article",
                link: "https://example.com/minimal",
              },
            ]),
          ),
        ),
      );

      const articles = await repository.fetchArticles(
        "https://example.com/minimal.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("Minimal Article");
      expect(articles[0].link).toBe("https://example.com/minimal");
      expect(articles[0].description).toBeUndefined();
      expect(articles[0].pubDate).toBeUndefined();
    });

    it("should return empty array for feed with no items", async () => {
      mockServer.use(
        http.get("https://example.com/empty.xml", () =>
          HttpResponse.xml(`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
              <channel>
                <title>Empty Feed</title>
              </channel>
            </rss>
          `),
        ),
      );

      const articles = await repository.fetchArticles(
        "https://example.com/empty.xml",
      );

      expect(articles).toEqual([]);
    });
  });

  describe("異常系", () => {
    it("should throw on HTTP error", async () => {
      mockServer.use(
        http.get(
          "https://example.com/error.xml",
          () => new HttpResponse(null, { status: 500 }),
        ),
      );

      await expect(
        repository.fetchArticles("https://example.com/error.xml"),
      ).rejects.toThrow("Failed to fetch RSS feed: HTTP 500");
    });
  });
});
