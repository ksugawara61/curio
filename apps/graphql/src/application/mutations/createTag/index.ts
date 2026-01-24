import { ServiceError } from "@getcronit/pylon";
import type { CreateTagInput, Tag } from "../../../infrastructure/domain/Tag";
import { TagRepository } from "../../../infrastructure/persistence/tags";
import { createDb } from "../../../libs/drizzle/client";

export type { CreateTagInput };

export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  const db = createDb();
  try {
    return await db.transaction(async (tx) => {
      const repository = new TagRepository(tx);
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
