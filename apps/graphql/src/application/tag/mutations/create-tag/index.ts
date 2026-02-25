import { ServiceError } from "@getcronit/pylon";
import type { ITagRepository } from "../../../../domain/tag/interface";
import type { CreateTagInput, Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import type { BaseApplication } from "../../../base";

export type { CreateTagInput };

export class CreateTag implements BaseApplication<CreateTagInput, Tag> {
  constructor(private readonly repository: ITagRepository) {}

  async invoke(input: CreateTagInput): Promise<Tag> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      throw new ServiceError(
        `Failed to create tag: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  return await DrizzleRepository.create().transaction(async (tx) => {
    const repository = new TagRepository(ContextRepository.create(), tx);
    return new CreateTag(repository).invoke(input);
  });
};
