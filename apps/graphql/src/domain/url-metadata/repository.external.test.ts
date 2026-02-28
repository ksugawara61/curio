import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { mockServer } from "../../libs/test/mockServer";
import { UrlMetadataRepository } from "./repository.external";

describe("UrlMetadataRepository", () => {
  const repository = new UrlMetadataRepository();

  describe("正常系", () => {
    it("should extract og:title and og:description", async () => {
      mockServer.use(
        http.get("https://example.com/og", () =>
          HttpResponse.html(`
            <html>
              <head>
                <meta property="og:title" content="OG Title" />
                <meta property="og:description" content="OG Description" />
                <meta property="og:image" content="https://example.com/og.png" />
              </head>
              <body></body>
            </html>
          `),
        ),
      );

      const result = await repository.fetchMetadata("https://example.com/og");

      expect(result.title).toBe("OG Title");
      expect(result.description).toBe("OG Description");
      expect(result.thumbnail).toBe("https://example.com/og.png");
    });

    it("should fall back to twitter:title when og:title is absent", async () => {
      mockServer.use(
        http.get("https://example.com/twitter", () =>
          HttpResponse.html(`
            <html>
              <head>
                <meta name="twitter:title" content="Twitter Title" />
                <meta name="twitter:description" content="Twitter Desc" />
                <meta name="twitter:image" content="https://example.com/tw.png" />
              </head>
              <body></body>
            </html>
          `),
        ),
      );

      const result = await repository.fetchMetadata(
        "https://example.com/twitter",
      );

      expect(result.title).toBe("Twitter Title");
      expect(result.description).toBe("Twitter Desc");
      expect(result.thumbnail).toBe("https://example.com/tw.png");
    });

    it("should fall back to <title> tag when og and twitter titles are absent", async () => {
      mockServer.use(
        http.get("https://example.com/title-tag", () =>
          HttpResponse.html(`
            <html>
              <head>
                <title>  Page Title  </title>
                <meta name="description" content="Meta Description" />
              </head>
              <body></body>
            </html>
          `),
        ),
      );

      const result = await repository.fetchMetadata(
        "https://example.com/title-tag",
      );

      expect(result.title).toBe("Page Title");
      expect(result.description).toBe("Meta Description");
      expect(result.thumbnail).toBeNull();
    });

    it("should return null fields when no meta tags are present", async () => {
      mockServer.use(
        http.get("https://example.com/no-meta", () =>
          HttpResponse.html("<html><head></head><body></body></html>"),
        ),
      );

      const result = await repository.fetchMetadata(
        "https://example.com/no-meta",
      );

      expect(result.title).toBeNull();
      expect(result.description).toBeNull();
      expect(result.thumbnail).toBeNull();
    });

    it("should return null fields when HTTP response is not ok", async () => {
      mockServer.use(
        http.get(
          "https://example.com/not-found",
          () => new HttpResponse(null, { status: 404 }),
        ),
      );

      const result = await repository.fetchMetadata(
        "https://example.com/not-found",
      );

      expect(result.title).toBeNull();
      expect(result.description).toBeNull();
      expect(result.thumbnail).toBeNull();
    });

    it("should handle meta tags with content attribute before property attribute", async () => {
      mockServer.use(
        http.get("https://example.com/reversed-meta", () =>
          HttpResponse.html(`
            <html>
              <head>
                <meta content="Reversed OG Title" property="og:title" />
              </head>
              <body></body>
            </html>
          `),
        ),
      );

      const result = await repository.fetchMetadata(
        "https://example.com/reversed-meta",
      );

      expect(result.title).toBe("Reversed OG Title");
    });
  });
});
