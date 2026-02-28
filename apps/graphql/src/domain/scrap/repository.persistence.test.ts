import { describe, expect, it } from "vitest";
import { ContextRepository } from "../../shared/context";
import { DrizzleRepository } from "../../shared/drizzle";
import { BookmarkRepository } from "../bookmark/repository.persistence";
import { ScrapRepository } from "./repository.persistence";

describe("ScrapRepository", () => {
  describe("findMany", () => {
    it("should return empty array when no scraps exist", async () => {
      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findMany();
      expect(result).toEqual([]);
    });

    it("should return scraps without bookmarks", async () => {
      await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          { title: "Scrap 1", content: "Content 1" },
        );
      });

      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findMany();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Scrap 1");
      expect(result[0].bookmarks).toEqual([]);
    });

    it("should return scraps with associated bookmarks", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Scrap Bookmark",
            url: `https://example.com/scrap-bm-${Date.now()}`,
          });
        },
      );

      await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap with Bookmark",
            content: "Content",
            bookmarkIds: [bookmark.id],
          },
        );
      });

      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findMany();

      const found = result.find((s) => s.title === "Scrap with Bookmark");
      expect(found).toBeDefined();
      expect(found?.bookmarks).toHaveLength(1);
      expect(found?.bookmarks?.[0].id).toBe(bookmark.id);
    });
  });

  describe("findById", () => {
    it("should return scrap by id with bookmarks", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Linked Bookmark",
            url: `https://example.com/linked-bm-${Date.now()}`,
          });
        },
      );

      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Findable Scrap",
            content: "Content",
            bookmarkIds: [bookmark.id],
          });
        },
      );

      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.bookmarks).toHaveLength(1);
      expect(result?.bookmarks?.[0].id).toBe(bookmark.id);
    });

    it("should return null for non-existent id", async () => {
      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create scrap without bookmarks", async () => {
      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "New Scrap", content: "# Heading" });
        },
      );

      expect(result).toHaveProperty("id");
      expect(result.title).toBe("New Scrap");
      expect(result.content).toBe("# Heading");
      expect(result.bookmarks).toEqual([]);
    });

    it("should create scrap with bookmarks", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Create Scrap Bookmark",
            url: `https://example.com/create-scrap-bm-${Date.now()}`,
          });
        },
      );

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Scrap With BM",
            content: "Content",
            bookmarkIds: [bookmark.id],
          });
        },
      );

      expect(result.bookmarks).toHaveLength(1);
      expect(result.bookmarks?.[0].id).toBe(bookmark.id);
    });
  });

  describe("update", () => {
    it("should update scrap preserving bookmarks when bookmarkIds not specified", async () => {
      const bookmark = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Preserve Bookmark",
            url: `https://example.com/preserve-bm-${Date.now()}`,
          });
        },
      );

      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Original Title",
            content: "Content",
            bookmarkIds: [bookmark.id],
          });
        },
      );

      const updated = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).update(created.id, { title: "Updated Title" });
        },
      );

      expect(updated.title).toBe("Updated Title");
      expect(updated.bookmarks).toHaveLength(1);
      expect(updated.bookmarks?.[0].id).toBe(bookmark.id);
    });

    it("should throw error for non-existent scrap", async () => {
      await expect(
        DrizzleRepository.create().transaction(async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).update("non-existent-id", { title: "New Title" });
        }),
      ).rejects.toThrow();
    });
  });

  describe("deleteScrap", () => {
    it("should delete scrap by id", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Delete Me", content: "Content" });
        },
      );

      await DrizzleRepository.create().transaction(async (tx) => {
        await new ScrapRepository(ContextRepository.create(), tx).deleteScrap(
          created.id,
        );
      });

      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById(created.id);
      expect(result).toBeNull();
    });

    it("should throw error for non-existent scrap", async () => {
      await expect(
        DrizzleRepository.create().transaction(async (tx) => {
          await new ScrapRepository(ContextRepository.create(), tx).deleteScrap(
            "non-existent-id",
          );
        }),
      ).rejects.toThrow();
    });
  });
});
