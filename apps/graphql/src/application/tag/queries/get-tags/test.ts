import { describe, expect, it, vi } from "vitest";
import { TagRepository } from "../../../../domain/tag/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { tags } from ".";

describe("tags", () => {
  describe("正常系", () => {
    it("should return array of tags", async () => {
      await DrizzleRepository.create().transaction(async (tx) => {
        const repository = new TagRepository(ContextRepository.create(), tx);
        await repository.create({ name: "Frontend" });
        await repository.create({ name: "Backend" });
        await repository.create({ name: "Database" });
      });

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

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(TagRepository, "create").mockReturnValue({
        findAll: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(tags()).rejects.toThrow(
        "Failed to fetch tags: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(TagRepository, "create").mockReturnValue({
        findAll: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(tags()).rejects.toThrow(
        "Failed to fetch tags: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
