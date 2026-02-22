import { describe, expect, it } from "vitest";
import { createDb } from "../../libs/drizzle/client";
import { RssFeedBatchRepository } from "./repository.batch";
import { RssFeedRepository } from "./repository.persistence";

describe("RssFeedBatchRepository", () => {
  describe("findAll", () => {
    it("should return empty array when no feeds exist", async () => {
      const repo = new RssFeedBatchRepository();
      const result = await repo.findAll();
      expect(result).toEqual([]);
    });

    it("should return all feeds across all users", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo1 = new RssFeedRepository("user-a", tx);
        await repo1.create({
          url: "https://example.com/feed-a.xml",
          title: "Feed A",
        });
      });

      await db.transaction(async (tx) => {
        const repo2 = new RssFeedRepository("user-b", tx);
        await repo2.create({
          url: "https://example.com/feed-b.xml",
          title: "Feed B",
        });
      });

      const batchRepo = new RssFeedBatchRepository();
      const result = await batchRepo.findAll();

      expect(result).toHaveLength(2);

      const userIds = result.map((f) => f.user_id).sort();
      expect(userIds).toEqual(["user-a", "user-b"]);

      const urls = result.map((f) => f.url).sort();
      expect(urls).toEqual([
        "https://example.com/feed-a.xml",
        "https://example.com/feed-b.xml",
      ]);
    });

    it("should return id, user_id and url fields", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      const batchRepo = new RssFeedBatchRepository();
      const result = await batchRepo.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id");
      expect(result[0].user_id).toBe("test-user");
      expect(result[0].url).toBe("https://example.com/feed.xml");
    });

    it("should return multiple feeds for a single user", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository("test-user", tx);
        await repo.create({
          url: "https://example.com/feed1.xml",
          title: "Feed 1",
        });
        await repo.create({
          url: "https://example.com/feed2.xml",
          title: "Feed 2",
        });
        await repo.create({
          url: "https://example.com/feed3.xml",
          title: "Feed 3",
        });
      });

      const batchRepo = new RssFeedBatchRepository();
      const result = await batchRepo.findAll();

      expect(result).toHaveLength(3);
      expect(result.every((f) => f.user_id === "test-user")).toBe(true);
    });
  });
});
