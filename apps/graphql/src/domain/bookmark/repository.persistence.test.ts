import { describe, expect, it } from "vitest";
import { ContextRepository } from "../../shared/context";
import { DrizzleRepository } from "../../shared/drizzle";
import { BookmarkRepository } from "./repository.persistence";

describe("BookmarkRepository", () => {
  describe("create", () => {
    it("should create a new bookmark", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
      };

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create(input);
        },
      );

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBe(input.description);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
      expect(result.created_at.getTime()).toBe(result.updated_at.getTime());
    });

    it("should create a bookmark without description", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
      };

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create(input);
        },
      );

      expect(result.title).toBe(input.title);
      expect(result.url).toBe(input.url);
      expect(result.description).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should return empty array when no bookmarks exist", async () => {
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findMany();
      expect(result).toEqual([]);
    });

    it("should return all bookmarks ordered by created_at desc", async () => {
      const bookmark1 = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Bookmark 1",
            url: "https://example1.com",
          });
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 10));

      const bookmark2 = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Bookmark 2",
            url: "https://example2.com",
          });
        },
      );

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findMany();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(bookmark2.id);
      expect(result[1].id).toBe(bookmark1.id);
    });
  });

  describe("findById", () => {
    it("should return bookmark by id", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com",
          });
        },
      );

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById(created.id);

      expect(result).toEqual(created);
    });

    it("should return null for non-existent id", async () => {
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("findByUrl", () => {
    it("should return bookmark by url", async () => {
      const testUrl = "https://example.com/findbyurl";

      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: testUrl,
          });
        },
      );

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findByUrl(testUrl);

      expect(result).toEqual(created);
    });

    it("should return bookmark with tags by url", async () => {
      const testUrl = "https://example.com/findbyurl-with-tags";

      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: testUrl,
            tagNames: ["tag1", "tag2"],
          });
        },
      );

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findByUrl(testUrl);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.tags).toHaveLength(2);
      expect(result?.tags?.map((tag) => tag.name).sort()).toEqual([
        "tag1",
        "tag2",
      ]);
    });

    it("should return null for non-existent url", async () => {
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findByUrl("https://non-existent-url.com");
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update existing bookmark", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Original Title",
            url: "https://example.com",
            description: "Original description",
          });
        },
      );

      const updateInput = {
        title: "Updated Title",
        description: "Updated description",
      };

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update(created.id, updateInput);
        },
      );

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe(updateInput.title);
      expect(result?.url).toBe(created.url);
      expect(result?.description).toBe(updateInput.description);
      expect(result?.created_at.getTime()).toBe(created.created_at.getTime());
      expect(result?.updated_at.getTime()).toBeGreaterThanOrEqual(
        created.updated_at.getTime(),
      );
    });

    it("should throw error for non-existent bookmark", async () => {
      await expect(
        DrizzleRepository.create().transaction(async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update("non-existent-id", {
            title: "Updated Title",
          });
        }),
      ).rejects.toThrow();
    });

    it("should update only provided fields", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Original Title",
            url: "https://example.com",
            description: "Original description",
          });
        },
      );

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update(created.id, {
            title: "Updated Title",
          });
        },
      );

      expect(result?.title).toBe("Updated Title");
      expect(result?.url).toBe(created.url);
      expect(result?.description).toBe(created.description);
    });
  });

  describe("deleteBookmark", () => {
    it("should delete existing bookmark", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com",
          });
        },
      );

      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new BookmarkRepository(
          ContextRepository.create(),
          tx,
        );
        await repository.deleteBookmark(created.id);
      });

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const fetched = await repository.findById(created.id);
      expect(fetched).toBeNull();
    });

    it("should throw error for non-existent bookmark", async () => {
      await expect(
        DrizzleRepository.create().transaction(async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          await repository.deleteBookmark("non-existent-id");
        }),
      ).rejects.toThrow();
    });
  });

  describe("tags functionality", () => {
    it("should create bookmark with tags", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        description: "A test bookmark",
        tagNames: ["tag1", "tag2", "tag3"],
      };

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create(input);
        },
      );

      expect(result).toHaveProperty("id");
      expect(result.title).toBe(input.title);
      expect(result.tags).toHaveLength(3);
      expect(result.tags?.map((tag) => tag.name).sort()).toEqual([
        "tag1",
        "tag2",
        "tag3",
      ]);
    });

    it("should find bookmark with tags", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com",
            tagNames: ["findTag1", "findTag2"],
          });
        },
      );

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const found = await repository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.tags).toHaveLength(2);
      expect(found?.tags?.map((tag) => tag.name).sort()).toEqual([
        "findTag1",
        "findTag2",
      ]);
    });

    it("should update bookmark tags", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com",
            tagNames: ["oldTag1", "oldTag2"],
          });
        },
      );

      const updated = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update(created.id, {
            tagNames: ["newTag1", "newTag2", "newTag3"],
          });
        },
      );

      expect(updated.tags).toHaveLength(3);
      expect(updated.tags?.map((tag) => tag.name).sort()).toEqual([
        "newTag1",
        "newTag2",
        "newTag3",
      ]);
    });

    it("should preserve existing tags when updating other fields", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Original Title",
            url: "https://example.com",
            tagNames: ["preserveTag1", "preserveTag2"],
          });
        },
      );

      const updated = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update(created.id, {
            title: "Updated Title",
          });
        },
      );

      expect(updated.title).toBe("Updated Title");
      expect(updated.tags).toHaveLength(2);
      expect(updated.tags?.map((tag) => tag.name).sort()).toEqual([
        "preserveTag1",
        "preserveTag2",
      ]);
    });

    it("should handle empty tag array", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create({
            title: "Test Bookmark",
            url: "https://example.com",
            tagNames: ["tag1", "tag2"],
          });
        },
      );

      const updated = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.update(created.id, {
            tagNames: [],
          });
        },
      );

      expect(updated.tags).toHaveLength(0);
    });

    it("should handle duplicate tag names", async () => {
      const input = {
        title: "Test Bookmark",
        url: "https://example.com",
        tagNames: ["duplicate", "duplicate", "unique"],
      };

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new BookmarkRepository(
            ContextRepository.create(),
            tx,
          );
          return await repository.create(input);
        },
      );

      expect(result.tags).toHaveLength(2);
      expect(result.tags?.map((tag) => tag.name).sort()).toEqual([
        "duplicate",
        "unique",
      ]);
    });
  });

  describe("related bookmarks", () => {
    it("should create a bookmark with related bookmarks", async () => {
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );

      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Bookmark A", url: "https://example-a.com" });
        },
      );

      const bookmarkB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark B",
            url: "https://example-b.com",
            relatedBookmarkIds: [bookmarkA.id],
          });
        },
      );

      expect(bookmarkB.relatedBookmarks).toHaveLength(1);
      expect(bookmarkB.relatedBookmarks?.[0].id).toBe(bookmarkA.id);

      // Verify bidirectionality: A should also have B as related
      const fetchedA = await repository.findById(bookmarkA.id);
      expect(fetchedA?.relatedBookmarks).toHaveLength(1);
      expect(fetchedA?.relatedBookmarks?.[0].id).toBe(bookmarkB.id);
    });

    it("should update related bookmarks and maintain bidirectionality", async () => {
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );

      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Bookmark A", url: "https://example-rel-a.com" });
        },
      );
      const bookmarkB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Bookmark B", url: "https://example-rel-b.com" });
        },
      );
      const bookmarkC = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark C",
            url: "https://example-rel-c.com",
            relatedBookmarkIds: [bookmarkA.id],
          });
        },
      );

      // C relates to A → now update C to relate to B instead
      const updatedC = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).update(bookmarkC.id, { relatedBookmarkIds: [bookmarkB.id] });
        },
      );

      expect(updatedC.relatedBookmarks).toHaveLength(1);
      expect(updatedC.relatedBookmarks?.[0].id).toBe(bookmarkB.id);

      // A should no longer have C as related
      const fetchedA = await repository.findById(bookmarkA.id);
      expect(fetchedA?.relatedBookmarks).toHaveLength(0);

      // B should now have C as related
      const fetchedB = await repository.findById(bookmarkB.id);
      expect(fetchedB?.relatedBookmarks).toHaveLength(1);
      expect(fetchedB?.relatedBookmarks?.[0].id).toBe(bookmarkC.id);
    });

    it("should clear related bookmarks when updated with empty array", async () => {
      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Bookmark A", url: "https://example-clr-a.com" });
        },
      );
      const bookmarkB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark B",
            url: "https://example-clr-b.com",
            relatedBookmarkIds: [bookmarkA.id],
          });
        },
      );

      const updatedB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).update(bookmarkB.id, { relatedBookmarkIds: [] });
        },
      );

      expect(updatedB.relatedBookmarks).toHaveLength(0);

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const fetchedA = await repository.findById(bookmarkA.id);
      expect(fetchedA?.relatedBookmarks).toHaveLength(0);
    });

    it("should remove related bookmark relations when bookmark is deleted", async () => {
      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({ title: "Bookmark A", url: "https://example-del-a.com" });
        },
      );
      const bookmarkB = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark B",
            url: "https://example-del-b.com",
            relatedBookmarkIds: [bookmarkA.id],
          });
        },
      );

      // Delete bookmark A
      await DrizzleRepository.create().transaction(async (tx) => {
        return await new BookmarkRepository(
          ContextRepository.create(),
          tx,
        ).deleteBookmark(bookmarkA.id);
      });

      // B should have no related bookmarks
      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const fetchedB = await repository.findById(bookmarkB.id);
      expect(fetchedB?.relatedBookmarks).toHaveLength(0);
    });

    it("findMany should include related bookmarks", async () => {
      const bookmarkA = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new BookmarkRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Bookmark A",
            url: "https://example-many-a.com",
          });
        },
      );
      await DrizzleRepository.create().transaction(async (tx) => {
        return await new BookmarkRepository(
          ContextRepository.create(),
          tx,
        ).create({
          title: "Bookmark B",
          url: "https://example-many-b.com",
          relatedBookmarkIds: [bookmarkA.id],
        });
      });

      const repository = new BookmarkRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const all = await repository.findMany();

      const b = all.find((bm) => bm.url === "https://example-many-b.com");
      const a = all.find((bm) => bm.url === "https://example-many-a.com");

      expect(b?.relatedBookmarks).toHaveLength(1);
      expect(b?.relatedBookmarks?.[0].id).toBe(bookmarkA.id);
      expect(a?.relatedBookmarks).toHaveLength(1);
      expect(a?.relatedBookmarks?.[0].id).toBe(b?.id);
    });
  });
});
