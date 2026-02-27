import { ServiceError } from "@getcronit/pylon";
import type { IScrapRepository } from "../../../../domain/scrap/interface";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { withTransaction } from "../../../../domain/shared/transaction";

const deleteScrapUseCase = async (
  id: string,
  { repository }: { repository: IScrapRepository },
): Promise<boolean> => {
  try {
    await repository.deleteScrap(id);
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No record was found")
    ) {
      throw new ServiceError("Scrap not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
    throw new ServiceError(
      `Failed to delete scrap: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const deleteScrap = async (id: string): Promise<boolean> => {
  return withTransaction(async (tx) =>
    deleteScrapUseCase(id, {
      repository: ScrapRepository.inTransaction(tx),
    }),
  );
};
