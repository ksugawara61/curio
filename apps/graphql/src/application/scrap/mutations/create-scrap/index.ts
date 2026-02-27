import { ServiceError } from "@getcronit/pylon";
import type {
  CreateScrapInput,
  IScrapRepository,
} from "../../../../domain/scrap/interface";
import type { Scrap } from "../../../../domain/scrap/model";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";
import { withTransaction } from "../../../../domain/shared/transaction";

export type { CreateScrapInput };

const createScrapUseCase = async (
  input: CreateScrapInput,
  { repository }: { repository: IScrapRepository },
): Promise<Scrap> => {
  try {
    return await repository.create(input);
  } catch (error) {
    throw new ServiceError(
      `Failed to create scrap: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const createScrap = async (input: CreateScrapInput): Promise<Scrap> => {
  return withTransaction(async (tx) =>
    createScrapUseCase(input, {
      repository: ScrapRepository.inTransaction(tx),
    }),
  );
};
