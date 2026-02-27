import { ServiceError } from "@getcronit/pylon";
import type { IScrapRepository } from "../../../../domain/scrap/interface";
import type { Scrap } from "../../../../domain/scrap/model";
import { ScrapRepository } from "../../../../domain/scrap/repository.persistence";

const getScrapsUseCase = async ({
  repository,
}: {
  repository: IScrapRepository;
}): Promise<Scrap[]> => {
  try {
    return await repository.findMany();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch scraps: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const scraps = async (): Promise<Scrap[]> => {
  const repository = ScrapRepository.create();
  return getScrapsUseCase({ repository });
};
