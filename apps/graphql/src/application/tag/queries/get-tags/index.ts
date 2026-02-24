import { ServiceError } from "@getcronit/pylon";
import type { ITagRepository } from "../../../../domain/tag/interface";
import type { Tag } from "../../../../domain/tag/model";
import { TagRepository } from "../../../../domain/tag/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class GetTags implements BaseApplication<void, Tag[]> {
  constructor(private readonly repository: ITagRepository) {}

  async invoke(): Promise<Tag[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch tags: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const tags = async (): Promise<Tag[]> => {
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  const repository = new TagRepository(userId);
  return new GetTags(repository).invoke();
};
