import { describe, expect, it, vi } from "vitest";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { scraps } from ".";

describe("scraps", () => {
  describe("正常系", () => {
    it("should return empty array when no scraps exist", async () => {
      const result = await scraps();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return array of scraps", async () => {
      await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap 1",
            content: "# First Scrap",
          },
        );
      });

      await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap 2",
            content: "# Second Scrap",
          },
        );
      });

      const result = await scraps();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("title");
      expect(result[0]).toHaveProperty("content");
      expect(result[0]).toHaveProperty("created_at");
      expect(result[0]).toHaveProperty("updated_at");
      expect(result[0]).toHaveProperty("bookmarks");
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(ScrapRepository, "create").mockReturnValue({
        findMany: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(scraps()).rejects.toThrow(
        "Failed to fetch scraps: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(ScrapRepository, "create").mockReturnValue({
        findMany: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(scraps()).rejects.toThrow(
        "Failed to fetch scraps: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
