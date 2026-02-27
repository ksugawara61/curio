import { ServiceError } from "@getcronit/pylon";
import type { IScrapRepository } from "../../../../domain/scrap/interface";
import type { Scrap } from "../../../../domain/scrap/model";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";

const getScrapUseCase = async (
  id: string,
  { repository }: { repository: IScrapRepository },
): Promise<Scrap | null> => {
  try {
    return await repository.findById(id);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch scrap: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const scrap = async (id: string): Promise<Scrap | null> => {
  const repository = ScrapRepository.create();
  return getScrapUseCase(id, { repository });
};
