import { describe, expect, it, vi } from "vitest";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { scrap } from ".";

describe("scrap", () => {
  describe("正常系", () => {
    it("should return scrap when found by id", async () => {
      const created = await DrizzleRepository.create().transaction(
        async (tx) => {
          return await new ScrapRepository(
            ContextRepository.create(),
            tx,
          ).create({
            title: "Test Scrap",
            content: "# Test\n\nMarkdown content.",
          });
        },
      );

      const result = await scrap(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
      expect(result?.title).toBe(created.title);
      expect(result?.content).toBe(created.content);
      expect(result?.bookmarks).toEqual([]);
    });

    it("should return null when scrap not found", async () => {
      const result = await scrap("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError when repository throws an Error", async () => {
      vi.spyOn(ScrapRepository, "create").mockReturnValue({
        findById: vi.fn().mockRejectedValue(new Error("DB connection failed")),
      } as never);
      await expect(scrap("some-id")).rejects.toThrow(
        "Failed to fetch scrap: DB connection failed",
      );
      vi.restoreAllMocks();
    });

    it("should throw ServiceError with Unknown error when repository throws a non-Error", async () => {
      vi.spyOn(ScrapRepository, "create").mockReturnValue({
        findById: vi.fn().mockRejectedValue("non-error string"),
      } as never);
      await expect(scrap("some-id")).rejects.toThrow(
        "Failed to fetch scrap: Unknown error",
      );
      vi.restoreAllMocks();
    });
  });
});
