import { describe, expect, it } from "vitest";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { deleteRssFeed } from ".";

describe("deleteRssFeed", () => {
  const createTestFeed = async () => {
    const db = createDb();
    const { getUserId } = ContextRepository.create();
    const userId = getUserId();

    return await db.transaction(async (tx) => {
      const repository = new RssFeedRepository(userId, tx);
      return await repository.create({
        url: `https://example.com/rss-${Date.now()}.xml`,
        title: "Test Feed",
        description: "A test feed",
      });
    });
  };

  describe("正常系", () => {
    it("should delete an RSS feed successfully", async () => {
      const feed = await createTestFeed();
      const result = await deleteRssFeed(feed.id);
      expect(result).toBe(true);
    });
  });

  describe("異常系", () => {
    it("should throw when RSS feed is not found", async () => {
      await expect(deleteRssFeed("nonexistent-id")).rejects.toThrow(
        "RSS feed not found",
      );
    });
  });
});
