import { ServiceError } from "@getcronit/pylon";
import type { Tag } from "../../../infrastructure/domain/Tag";
import { ContextRepository } from "../../../infrastructure/internal/context";
import { TagRepository } from "../../../infrastructure/persistence/tags";

export const tags = async (): Promise<Tag[]> => {
  try {
    const { getUserId } = new ContextRepository();
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
