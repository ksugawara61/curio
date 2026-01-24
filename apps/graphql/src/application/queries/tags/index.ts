import { ServiceError } from "@getcronit/pylon";
import type { Tag } from "../../infrastructure/domain/Tag";
import * as tagRepository from "../../infrastructure/persistence/TagRepository";

export const tags = async (): Promise<Tag[]> => {
  try {
    return await tagRepository.findAll();
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
