import { describe, expect, it } from "vitest";
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
});
