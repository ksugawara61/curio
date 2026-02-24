import { describe, expect, it } from "vitest";
import { createDb } from "../../libs/drizzle/client";
import { mockAuthContext } from "../../libs/test/authHelper";
import { ContextRepository } from "../../shared/context";
import { RssFeedRepository } from "./repository.persistence";

describe("RssFeedRepository", () => {
  describe("create", () => {
    it("should create a new RSS feed", async () => {
      const db = createDb();
      const input = {
        url: "https://example.com/feed.xml",
        title: "Example Feed",
        description: "An example RSS feed",
      };

      const result = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create(input);
      });

      expect(result).toHaveProperty("id");
      expect(result.url).toBe(input.url);
      expect(result.title).toBe(input.title);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should create a feed without description", async () => {
      const db = createDb();

      const result = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Example Feed",
        });
      });

      expect(result.description).toBeNull();
    });

    it("should throw when creating a feed with duplicate URL for same user", async () => {
      const db = createDb();
      const url = "https://example.com/duplicate-feed.xml";

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({ url, title: "Feed 1" });
      });

      await expect(
        db.transaction(async (tx) => {
          const repo = new RssFeedRepository(ContextRepository.create(), tx);
          await repo.create({ url, title: "Feed 2" });
        }),
      ).rejects.toThrow();
    });

    it("should allow same URL for different users", async () => {
      const db = createDb();
      const url = "https://example.com/shared-feed.xml";

      mockAuthContext({ userId: "user-a" });
      const feedA = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({ url, title: "Shared Feed" });
      });

      mockAuthContext({ userId: "user-b" });
      const feedB = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({ url, title: "Shared Feed" });
      });

      expect(feedA.id).not.toBe(feedB.id);
      expect(feedA.url).toBe(feedB.url);
    });
  });

  describe("findAll", () => {
    it("should return empty array when no feeds exist", async () => {
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findAll();
      expect(result).toEqual([]);
    });

    it("should return only feeds for the given user", async () => {
      const db = createDb();

      mockAuthContext({ userId: "user-a" });
      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed-a.xml",
          title: "Feed A",
        });
      });

      mockAuthContext({ userId: "user-b" });
      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed-b.xml",
          title: "Feed B",
        });
      });

      mockAuthContext({ userId: "user-a" });
      const repoA = new RssFeedRepository(ContextRepository.create());
      const resultA = await repoA.findAll();
      expect(resultA).toHaveLength(1);
      expect(resultA[0].url).toBe("https://example.com/feed-a.xml");

      mockAuthContext({ userId: "user-b" });
      const repoB = new RssFeedRepository(ContextRepository.create());
      const resultB = await repoB.findAll();
      expect(resultB).toHaveLength(1);
      expect(resultB[0].url).toBe("https://example.com/feed-b.xml");
    });

    it("should return feeds ordered by created_at", async () => {
      const db = createDb();

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed1.xml",
          title: "Feed 1",
        });
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed2.xml",
          title: "Feed 2",
        });
      });

      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].url).toBe("https://example.com/feed1.xml");
      expect(result[1].url).toBe("https://example.com/feed2.xml");
    });
  });

  describe("findById", () => {
    it("should return a feed by id", async () => {
      const db = createDb();

      const created = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.url).toBe(created.url);
    });

    it("should return null for non-existent id", async () => {
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findById("non-existent-id");
      expect(result).toBeNull();
    });

    it("should return null when id belongs to a different user", async () => {
      const db = createDb();

      mockAuthContext({ userId: "user-a" });
      const created = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Feed A",
        });
      });

      mockAuthContext({ userId: "user-b" });
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findById(created.id);
      expect(result).toBeNull();
    });
  });

  describe("findByUrl", () => {
    it("should return a feed by url", async () => {
      const db = createDb();
      const url = "https://example.com/findbyurl-feed.xml";

      const created = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({ url, title: "Test Feed" });
      });

      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findByUrl(url);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
    });

    it("should return null for non-existent url", async () => {
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findByUrl("https://non-existent.com/feed.xml");
      expect(result).toBeNull();
    });

    it("should return null when url belongs to a different user", async () => {
      const db = createDb();
      const url = "https://example.com/other-user-feed.xml";

      mockAuthContext({ userId: "user-a" });
      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({ url, title: "Feed A" });
      });

      mockAuthContext({ userId: "user-b" });
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findByUrl(url);
      expect(result).toBeNull();
    });
  });

  describe("findAllForBatch", () => {
    it("should return empty array when no feeds exist", async () => {
      const result = await RssFeedRepository.findAllForBatch();
      expect(result).toEqual([]);
    });

    it("should return all feeds across all users", async () => {
      const db = createDb();

      mockAuthContext({ userId: "user-a" });
      await db.transaction(async (tx) => {
        const repo1 = new RssFeedRepository(ContextRepository.create(), tx);
        await repo1.create({
          url: "https://example.com/feed-a.xml",
          title: "Feed A",
        });
      });

      mockAuthContext({ userId: "user-b" });
      await db.transaction(async (tx) => {
        const repo2 = new RssFeedRepository(ContextRepository.create(), tx);
        await repo2.create({
          url: "https://example.com/feed-b.xml",
          title: "Feed B",
        });
      });

      const result = await RssFeedRepository.findAllForBatch();

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

      mockAuthContext({ userId: "test-user" });
      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      const result = await RssFeedRepository.findAllForBatch();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty("id");
      expect(result[0].user_id).toBe("test-user");
      expect(result[0].url).toBe("https://example.com/feed.xml");
    });

    it("should return multiple feeds for a single user", async () => {
      const db = createDb();

      mockAuthContext({ userId: "test-user" });
      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
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

      const result = await RssFeedRepository.findAllForBatch();

      expect(result).toHaveLength(3);
      expect(result.every((f) => f.user_id === "test-user")).toBe(true);
    });
  });

  describe("remove", () => {
    it("should remove an existing feed", async () => {
      const db = createDb();

      const created = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Test Feed",
        });
      });

      await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        await repo.remove(created.id);
      });

      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findById(created.id);
      expect(result).toBeNull();
    });

    it("should throw when removing a non-existent feed", async () => {
      const db = createDb();

      await expect(
        db.transaction(async (tx) => {
          const repo = new RssFeedRepository(ContextRepository.create(), tx);
          await repo.remove("non-existent-id");
        }),
      ).rejects.toThrow("No record was found");
    });

    it("should not remove a feed belonging to another user", async () => {
      const db = createDb();

      mockAuthContext({ userId: "user-a" });
      const created = await db.transaction(async (tx) => {
        const repo = new RssFeedRepository(ContextRepository.create(), tx);
        return await repo.create({
          url: "https://example.com/feed.xml",
          title: "Feed A",
        });
      });

      mockAuthContext({ userId: "user-b" });
      await expect(
        db.transaction(async (tx) => {
          const repo = new RssFeedRepository(ContextRepository.create(), tx);
          await repo.remove(created.id);
        }),
      ).rejects.toThrow("No record was found");

      mockAuthContext({ userId: "user-a" });
      const repo = new RssFeedRepository(ContextRepository.create());
      const result = await repo.findById(created.id);
      expect(result).not.toBeNull();
    });
  });
});
