import { ServiceError } from "@getcronit/pylon";
import type { ITagRepository } from "../../../../domain/tag/interface";
import type { Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";

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
  const repository = TagRepository.create();
  return getTagsUseCase({ repository });
};
