import { describe, expect, it, vi } from "vitest";
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

describe("createRssFeed", () => {
  describe("正常系", () => {
    it("should create an RSS feed successfully", async () => {
      mockFetchAndValidate.mockResolvedValue({
        title: "Test Blog",
        description: "A test blog feed",
      });

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

      const result = await createRssFeed(
        `https://example.com/rss-${Date.now()}.xml`,
      );

      expect(result.title).toBe("No Desc Blog");
      expect(result.description).toBeNull();
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
      await createRssFeed(url);

      await expect(createRssFeed(url)).rejects.toThrow("is already registered");
    });
  });
});
