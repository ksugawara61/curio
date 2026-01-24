import { ServiceError } from "@getcronit/pylon";
import type { CreateTagInput, Tag } from "../../infrastructure/domain/Tag";
import * as tagRepository from "../../infrastructure/persistence/TagRepository";

export type { CreateTagInput };

export const createTagUseCase = async (input: CreateTagInput): Promise<Tag> => {
  try {
    return await tagRepository.create(input);
  } catch (error) {
    throw new ServiceError(
      `Failed to create tag: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
