import { describe, expect, it } from "vitest";
import { mockServer } from "../../libs/test/mockServer";
import { RssFeedExternalRepository } from "./repository.external";
import { RssFeedExternalMocks } from "./repository.external.mocks";

describe("RssFeedExternalRepository", () => {
  const repository = new RssFeedExternalRepository();

  describe("正常系", () => {
    it("should parse RSS 2.0 items", async () => {
      mockServer.use(RssFeedExternalMocks.Rss);

      const articles = await repository.fetchArticles(
        "https://example.com/rss.xml",
      );

      expect(articles).toHaveLength(2);
      expect(articles[0]).toEqual({
        title: "Article 1",
        link: "https://example.com/1",
        description: "Description 1",
        pubDate: "Mon, 01 Jan 2024 00:00:00 GMT",
        thumbnailUrl: "https://example.com/img1.jpg",
      });
      expect(articles[1]).toEqual({
        title: "Article 2",
        link: "https://example.com/2",
        description: "Description 2",
        pubDate: "Tue, 02 Jan 2024 00:00:00 GMT",
        thumbnailUrl: undefined,
      });
    });

    it("should parse Atom entries", async () => {
      mockServer.use(RssFeedExternalMocks.Atom);

      const articles = await repository.fetchArticles(
        "https://example.com/atom.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0]).toEqual({
        title: "Entry 1",
        link: "https://example.com/entry/1",
        description: "Summary 1",
        pubDate: "2024-01-01T00:00:00Z",
        thumbnailUrl: "https://example.com/thumb1.png",
      });
    });

    it("should handle items without optional fields", async () => {
      mockServer.use(RssFeedExternalMocks.MinimalRssItem);

      const articles = await repository.fetchArticles(
        "https://example.com/minimal.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("Minimal Article");
      expect(articles[0].link).toBe("https://example.com/minimal");
      expect(articles[0].description).toBeUndefined();
      expect(articles[0].pubDate).toBeUndefined();
      expect(articles[0].thumbnailUrl).toBeUndefined();
    });

    it("should extract thumbnailUrl from enclosure", async () => {
      mockServer.use(RssFeedExternalMocks.WithEnclosure);

      const articles = await repository.fetchArticles(
        "https://example.com/enclosure.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].thumbnailUrl).toBe("https://example.com/photo.jpg");
    });

    it("should extract thumbnailUrl from media:content", async () => {
      mockServer.use(RssFeedExternalMocks.WithMediaContent);

      const articles = await repository.fetchArticles(
        "https://example.com/media-content.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].thumbnailUrl).toBe("https://example.com/media.png");
    });

    it("should return empty array for feed with no items", async () => {
      mockServer.use(RssFeedExternalMocks.Empty);

      const articles = await repository.fetchArticles(
        "https://example.com/empty.xml",
      );

      expect(articles).toEqual([]);
    });

    it("should strip CDATA wrappers from RSS item fields", async () => {
      mockServer.use(RssFeedExternalMocks.CdataRss);

      const articles = await repository.fetchArticles(
        "https://example.com/cdata-rss.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("CDATA Article Title");
      expect(articles[0].description).toBe("CDATA description text");
    });

    it("should strip CDATA wrappers from Atom entry fields", async () => {
      mockServer.use(RssFeedExternalMocks.CdataAtom);

      const articles = await repository.fetchArticles(
        "https://example.com/cdata-atom.xml",
      );

      expect(articles).toHaveLength(1);
      expect(articles[0].title).toBe("CDATA Entry Title");
      expect(articles[0].description).toBe("CDATA summary text");
    });
  });

  describe("異常系", () => {
    it("should throw on HTTP error", async () => {
      mockServer.use(RssFeedExternalMocks.FetchError);

      await expect(
        repository.fetchArticles("https://example.com/error.xml"),
      ).rejects.toThrow("Failed to fetch RSS feed: HTTP 500");
    });
  });
});
