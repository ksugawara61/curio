import { ServiceError } from "@getcronit/pylon";
import type { Tag } from "../../../infrastructure/domain/Tag";
import { TagRepository } from "../../../infrastructure/persistence/tags";
import { getUserId } from "../../../middleware/auth";

export const tags = async (): Promise<Tag[]> => {
  try {
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
