import { ServiceError } from "@getcronit/pylon";
import type {
  IScrapRepository,
  UpdateScrapInput,
} from "../../../../domain/scrap/interface";
import type { Scrap } from "../../../../domain/scrap/model";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { withTransaction } from "../../../../domain/shared/transaction";

export type { UpdateScrapInput };

const updateScrapUseCase = async (
  { id, input }: { id: string; input: UpdateScrapInput },
  { repository }: { repository: IScrapRepository },
): Promise<Scrap> => {
  try {
    return await repository.update(id, input);
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
      `Failed to update scrap: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const updateScrap = async (
  id: string,
  input: UpdateScrapInput,
): Promise<Scrap> => {
  return withTransaction(async (tx) =>
    updateScrapUseCase(
      { id, input },
      { repository: ScrapRepository.inTransaction(tx) },
    ),
  );
};
