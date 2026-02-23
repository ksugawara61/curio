import { describe, expect, it } from "vitest";
import { mockServer } from "../../../../libs/test/mockServer";
import { fetchAndValidateRssFeed, rssFeedUrlSchema } from "./validate";
import { FetchRssFeedMocks } from "./validate.mocks";

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
      mockServer.use(FetchRssFeedMocks.Rss);

      const result = await fetchAndValidateRssFeed(
        "https://example.com/rss.xml",
      );

      expect(result).toEqual({
        title: "My Blog",
        description: "A blog about things",
      });
    });

    it("should parse a valid Atom feed", async () => {
      mockServer.use(FetchRssFeedMocks.Atom);

      const result = await fetchAndValidateRssFeed(
        "https://example.com/atom.xml",
      );

      expect(result).toEqual({
        title: "My Atom Blog",
        description: "An Atom feed",
      });
    });

    it("should handle RSS feed without description", async () => {
      mockServer.use(FetchRssFeedMocks.RssWithoutDescription);

      const result = await fetchAndValidateRssFeed(
        "https://example.com/no-desc.xml",
      );

      expect(result.title).toBe("No Desc Blog");
      expect(result.description).toBeUndefined();
    });
  });

  describe("異常系", () => {
    it("should throw on HTTP error responses", async () => {
      mockServer.use(FetchRssFeedMocks.NotFound);

      await expect(
        fetchAndValidateRssFeed("https://example.com/not-found.xml"),
      ).rejects.toThrow("Failed to fetch RSS feed: HTTP 404");
    });

    it("should throw on invalid XML content", async () => {
      mockServer.use(FetchRssFeedMocks.HtmlPage);

      await expect(
        fetchAndValidateRssFeed("https://example.com/page"),
      ).rejects.toThrow("The URL does not point to a valid RSS or Atom feed");
    });
  });
});
