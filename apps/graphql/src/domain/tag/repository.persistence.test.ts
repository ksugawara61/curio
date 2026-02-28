import { describe, expect, it } from "vitest";
import { ContextRepository } from "../../shared/context";
import { DrizzleRepository } from "../../shared/drizzle";
import { TagRepository } from "./repository.persistence";

describe("TagRepository", () => {
  describe("findAll", () => {
    it("should return empty array when no tags exist", async () => {
      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findAll();
      expect(result).toEqual([]);
    });

    it("should return all tags ordered by name", async () => {
      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new TagRepository(ContextRepository.create(), tx);
        await repository.create({ name: "Zebra" });
        await repository.create({ name: "Apple" });
        await repository.create({ name: "Mango" });
      });

      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findAll();

      expect(result).toHaveLength(3);
      expect(result.map((t) => t.name)).toEqual(["Apple", "Mango", "Zebra"]);
    });
  });

  describe("findById", () => {
    it("should return tag by id", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "findById-tag" });
        },
      );

      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.name).toBe(created.name);
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });

    it("should return null for non-existent id", async () => {
      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById("non-existent-id");
      expect(result).toBeNull();
    });
  });

  describe("findByName", () => {
    it("should return tag by name", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "findByName-tag" });
        },
      );

      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findByName("findByName-tag");

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.name).toBe("findByName-tag");
    });

    it("should return null for non-existent name", async () => {
      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findByName("non-existent-tag");
      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create a new tag", async () => {
      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "new-tag" });
        },
      );

      expect(result).toHaveProperty("id");
      expect(result.name).toBe("new-tag");
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });
  });

  describe("findOrCreate", () => {
    it("should create a new tag when it does not exist", async () => {
      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.findOrCreate("brand-new-tag");
        },
      );

      expect(result).toHaveProperty("id");
      expect(result.name).toBe("brand-new-tag");
    });

    it("should return existing tag when it already exists", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "existing-tag" });
        },
      );

      const result = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.findOrCreate("existing-tag");
        },
      );

      expect(result.id).toBe(created.id);
      expect(result.name).toBe("existing-tag");
    });
  });

  describe("update", () => {
    it("should update tag name", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "original-name" });
        },
      );

      const updated = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.update(created.id, { name: "updated-name" });
        },
      );

      expect(updated.id).toBe(created.id);
      expect(updated.name).toBe("updated-name");
      expect(updated.updated_at.getTime()).toBeGreaterThanOrEqual(
        created.updated_at.getTime(),
      );
    });
  });

  describe("remove", () => {
    it("should remove tag by id", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          const repository = new TagRepository(ContextRepository.create(), tx);
          return await repository.create({ name: "tag-to-remove" });
        },
      );

      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new TagRepository(ContextRepository.create(), tx);
        await repository.remove(created.id);
      });

      const repository = new TagRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const result = await repository.findById(created.id);
      expect(result).toBeNull();
    });
  });
});
