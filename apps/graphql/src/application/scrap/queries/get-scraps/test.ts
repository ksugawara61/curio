import { describe, expect, it } from "vitest";
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
});
