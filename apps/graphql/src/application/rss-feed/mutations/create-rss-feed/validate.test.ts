import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { mockServer } from "../../../../libs/test/mockServer";
import { fetchAndValidateRssFeed, rssFeedUrlSchema } from "./validate";

const createRssXml = (title: string, description: string) => `
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${title}</title>
    <description>${description}</description>
    <item>
      <title>Test Article</title>
      <link>https://example.com/article</link>
    </item>
  </channel>
</rss>
`;

const createAtomXml = (title: string, subtitle: string) => `
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${title}</title>
  <subtitle>${subtitle}</subtitle>
  <entry>
    <title>Test Entry</title>
    <link href="https://example.com/entry"/>
  </entry>
</feed>
`;

describe("rssFeedUrlSchema", () => {
  it("should accept a valid https URL", () => {
    const result = rssFeedUrlSchema.safeParse("https://example.com/rss.xml");
    expect(result.success).toBe(true);
  });

  it("should accept a valid http URL", () => {
    const result = rssFeedUrlSchema.safeParse("http://example.com/rss.xml");
    expect(result.success).toBe(true);
  });

  it("should reject non-http(s) URLs", () => {
    const result = rssFeedUrlSchema.safeParse("ftp://example.com/rss.xml");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe(
        "URL must use http or https protocol",
      );
    }
  });

  it("should reject invalid URL format", () => {
    const result = rssFeedUrlSchema.safeParse("not-a-url");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors[0].message).toBe("Invalid URL format");
    }
  });
});

describe("fetchAndValidateRssFeed", () => {
  describe("正常系", () => {
    it("should parse a valid RSS 2.0 feed", async () => {
      mockServer.use(
        http.get("https://example.com/rss.xml", () =>
          HttpResponse.xml(createRssXml("My Blog", "A blog about things")),
        ),
      );

      const result = await fetchAndValidateRssFeed(
        "https://example.com/rss.xml",
      );

      expect(result).toEqual({
        title: "My Blog",
        description: "A blog about things",
      });
    });

    it("should parse a valid Atom feed", async () => {
      mockServer.use(
        http.get("https://example.com/atom.xml", () =>
          HttpResponse.xml(createAtomXml("My Atom Blog", "An Atom feed")),
        ),
      );

      const result = await fetchAndValidateRssFeed(
        "https://example.com/atom.xml",
      );

      expect(result).toEqual({
        title: "My Atom Blog",
        description: "An Atom feed",
      });
    });

    it("should handle RSS feed without description", async () => {
      mockServer.use(
        http.get("https://example.com/no-desc.xml", () =>
          HttpResponse.xml(`
            <?xml version="1.0" encoding="UTF-8"?>
            <rss version="2.0">
              <channel>
                <title>No Desc Blog</title>
              </channel>
            </rss>
          `),
        ),
      );

      const result = await fetchAndValidateRssFeed(
        "https://example.com/no-desc.xml",
      );

      expect(result.title).toBe("No Desc Blog");
      expect(result.description).toBeUndefined();
    });
  });

  describe("異常系", () => {
    it("should throw on HTTP error responses", async () => {
      mockServer.use(
        http.get(
          "https://example.com/not-found.xml",
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      await expect(
        fetchAndValidateRssFeed("https://example.com/not-found.xml"),
      ).rejects.toThrow("Failed to fetch RSS feed: HTTP 404");
    });

    it("should throw on invalid XML content", async () => {
      mockServer.use(
        http.get("https://example.com/page", () =>
          HttpResponse.html("<html><body>Not a feed</body></html>"),
        ),
      );

      await expect(
        fetchAndValidateRssFeed("https://example.com/page"),
      ).rejects.toThrow("The URL does not point to a valid RSS or Atom feed");
    });
  });
});
