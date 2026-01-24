import { describe, expect, it } from "vitest";
import { createDb } from "../../../libs/drizzle/client";
import { TagRepository } from "../../../infrastructure/persistence/tags";
import { tags } from ".";

describe("tags", () => {
  describe("正常系", () => {
    it("should return array of tags", async () => {
      const db = createDb();
      await Promise.all([
        db.transaction(async (tx) => {
          const repository = new TagRepository(tx);
          return await repository.create({ name: "Frontend" });
        }),
        db.transaction(async (tx) => {
          const repository = new TagRepository(tx);
          return await repository.create({ name: "Backend" });
        }),
        db.transaction(async (tx) => {
          const repository = new TagRepository(tx);
          return await repository.create({ name: "Database" });
        }),
      ]);

      const result = await tags();

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("name");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");

      // Check tags are sorted by name (ascending)
      const tagNames = result.map((tag) => tag.name);
      expect(tagNames).toEqual(["Backend", "Database", "Frontend"]);
    });

    it("should return empty array when no tags exist", async () => {
      const result = await tags();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
