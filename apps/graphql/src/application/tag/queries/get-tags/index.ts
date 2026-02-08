import { ServiceError } from "@getcronit/pylon";
import type { Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";
import { ContextRepository } from "../../../../shared/context";

export const tags = async (): Promise<Tag[]> => {
  try {
    const { getUserId } = ContextRepository.create();
    const userId = getUserId();
    const repository = new TagRepository(userId);
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
