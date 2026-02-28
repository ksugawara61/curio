import { describe, expect, it, vi } from "vitest";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { deleteRssFeed } from ".";

describe("deleteRssFeed", () => {
  const createTestFeed = async () => {
    return await DrizzleRepository.create().transaction(async (tx) => {
      const repository = new RssFeedRepository(ContextRepository.create(), tx);
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

    it("should throw ServiceError when repository throws an unexpected Error", async () => {
      vi.spyOn(RssFeedRepository.prototype, "remove").mockRejectedValue(
        new Error("Unexpected DB error"),
      );
      await expect(deleteRssFeed("some-id")).rejects.toThrow(
        "Failed to delete RSS feed: Unexpected DB error",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(RssFeedRepository.prototype, "remove").mockRejectedValue(
        "non-error string",
      );
      await expect(deleteRssFeed("some-id")).rejects.toThrow(
        "Failed to delete RSS feed: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
