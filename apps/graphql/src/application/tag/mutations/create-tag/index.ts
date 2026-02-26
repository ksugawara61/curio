import { ServiceError } from "@getcronit/pylon";
import { withTransaction } from "../../../../domain/shared/transaction";
import type { ITagRepository } from "../../../../domain/tag/interface";
import type { Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";

export type CreateTagInput = {
  name: string;
};

const createTagUseCase = async (
  input: CreateTagInput,
  { repository }: { repository: ITagRepository },
): Promise<Tag> => {
  try {
    return await repository.create(input);
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

export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  return withTransaction(async (tx) =>
    createTagUseCase(input, { repository: TagRepository.inTransaction(tx) }),
  );
};
