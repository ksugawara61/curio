import { describe, expect, it } from "vitest";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { deleteScrap } from ".";

describe("deleteScrap", () => {
  describe("正常系", () => {
    it("should delete a scrap successfully", async () => {
      const scrap = await DrizzleRepository.create().transaction(async (tx) => {
        return await new ScrapRepository(ContextRepository.create(), tx).create(
          {
            title: "Scrap to delete",
            content: "This will be deleted.",
          },
        );
      });

      const result = await deleteScrap(scrap.id);

      expect(result).toBe(true);

      const repository = new ScrapRepository(
        ContextRepository.create(),
        DrizzleRepository.create().getDb(),
      );
      const deletedScrap = await repository.findById(scrap.id);
      expect(deletedScrap).toBeNull();
    });
  });

  describe("異常系", () => {
    it("should throw ServiceError with NOT_FOUND when scrap does not exist", async () => {
      await expect(deleteScrap("non-existent-id")).rejects.toThrowError(
        expect.objectContaining({
          message: "Scrap not found",
        }),
      );
    });
  });
});
