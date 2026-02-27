import { describe, expect, it } from "vitest";
import { createBookmark } from ".";

describe("createBookmark", () => {
  describe("正常系", () => {
    it("should create a bookmark successfully", async () => {
      const input = {
        title: "Test Bookmark",
        url: `https://example.com/create-test-1-${Date.now()}`,
        description: "A test bookmark",
      };

      const result = await createBookmark(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: `https://example.com/create-test-2-${Date.now()}`,
      };

      const result = await createBookmark(input);

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBeNull();
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create a bookmark with related bookmarks", async () => {
      const bookmarkA = await createBookmark({
        title: "Bookmark A",
        url: `https://example.com/related-a-${Date.now()}`,
      });

      const bookmarkB = await createBookmark({
        title: "Bookmark B",
        url: `https://example.com/related-b-${Date.now()}`,
        relatedBookmarkIds: [bookmarkA.id],
      });

      expect(bookmarkB.relatedBookmarks).toHaveLength(1);
      expect(bookmarkB.relatedBookmarks?.[0].id).toBe(bookmarkA.id);
    });
  });

  describe("異常系", () => {
    it("should throw error when creating bookmark with duplicate URL", async () => {
      const url = `https://example.com/duplicate-test-${Date.now()}`;

      await createBookmark({
        title: "First Bookmark",
        url,
      });

      await expect(
        createBookmark({
          title: "Second Bookmark",
          url,
        }),
      ).rejects.toThrowError(/Bookmark with this URL already exists/);
    });
  });
});
