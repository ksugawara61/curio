import { ServiceError } from "@getcronit/pylon";
import type { CreateTagInput, Tag } from "../../../domain/tag/model";
import { TagRepository } from "../../../domain/tag/repository.persistence";
import { createDb } from "../../../libs/drizzle/client";
import { ContextRepository } from "../../../shared/context";

export type { CreateTagInput };

export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  try {
    return await db.transaction(async (tx) => {
      const repository = new TagRepository(userId, tx);
      return await repository.create(input);
    });
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
