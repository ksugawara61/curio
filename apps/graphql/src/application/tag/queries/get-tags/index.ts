import { ServiceError } from "@getcronit/pylon";
import type { ITagRepository } from "../../../../domain/tag/interface";
import type { Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

const getTagsUseCase = async ({
  repository,
}: {
  repository: ITagRepository;
}): Promise<Tag[]> => {
  try {
    return await repository.findAll();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch tags: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

export const tags = async (): Promise<Tag[]> => {
  const repository = new TagRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return getTagsUseCase({ repository });
};
