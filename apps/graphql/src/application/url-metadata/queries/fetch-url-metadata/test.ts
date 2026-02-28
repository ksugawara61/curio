import { ServiceError } from "@getcronit/pylon";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";
import { UrlMetadataRepository } from "../../../../domain/url-metadata/repository.external";
import { mockServer } from "../../../../libs/test/mockServer";
import { fetchUrlMetadata } from ".";

describe("fetchUrlMetadata", () => {
  describe("正常系", () => {
    it("should return metadata for a valid URL", async () => {
      mockServer.use(
        http.get("https://example.com/page", () =>
          HttpResponse.html(`
            <html>
              <head>
                <meta property="og:title" content="Page Title" />
                <meta property="og:description" content="Page Description" />
                <meta property="og:image" content="https://example.com/image.png" />
              </head>
              <body></body>
            </html>
          `),
        ),
      );

      const result = await fetchUrlMetadata("https://example.com/page");

      expect(result.title).toBe("Page Title");
      expect(result.description).toBe("Page Description");
      expect(result.thumbnail).toBe("https://example.com/image.png");
    });

    it("should return null fields when page has no meta tags", async () => {
      mockServer.use(
        http.get("https://example.com/empty-page", () =>
          HttpResponse.html("<html><head></head><body></body></html>"),
        ),
      );

      const result = await fetchUrlMetadata("https://example.com/empty-page");

      expect(result.title).toBeNull();
      expect(result.description).toBeNull();
      expect(result.thumbnail).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError for an invalid URL", async () => {
      await expect(fetchUrlMetadata("not-a-valid-url")).rejects.toThrow(
        "Invalid URL",
      );
    });

    it("should throw ServiceError when fetch fails with an unexpected error", async () => {
      mockServer.use(
        http.get("https://example.com/error-page", () => HttpResponse.error()),
      );

      await expect(
        fetchUrlMetadata("https://example.com/error-page"),
      ).rejects.toThrow("Failed to fetch URL metadata");
    });

    it("should rethrow ServiceError when repository throws a ServiceError", async () => {
      vi.spyOn(
        UrlMetadataRepository.prototype,
        "fetchMetadata",
      ).mockRejectedValue(
        new ServiceError("Service unavailable", {
          statusCode: 503,
          code: "INTERNAL_ERROR",
        }),
      );
      await expect(
        fetchUrlMetadata("https://example.com/service-error"),
      ).rejects.toThrow("Service unavailable");
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(
        UrlMetadataRepository.prototype,
        "fetchMetadata",
      ).mockRejectedValue("non-error string");
      await expect(
        fetchUrlMetadata("https://example.com/non-error"),
      ).rejects.toThrow("Failed to fetch URL metadata: Unknown error");
      vi.restoreAllMocks();
    });
  });
});
