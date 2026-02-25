import { ServiceError } from "@getcronit/pylon";
import type { IRssFeedRepository } from "../../../../domain/rss-feed/interface";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import type { BaseApplication } from "../../../base";

export class DeleteRssFeed implements BaseApplication<string, boolean> {
  constructor(private readonly repository: IRssFeedRepository) {}

  async invoke(id: string): Promise<boolean> {
    try {
      await this.repository.remove(id);
      return true;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("No record was found")
      ) {
        throw new ServiceError("RSS feed not found", {
          statusCode: 404,
          code: "NOT_FOUND",
        });
      }
      throw new ServiceError(
        `Failed to delete RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const deleteRssFeed = async (id: string): Promise<boolean> => {
  return await DrizzleRepository.create().transaction(async (tx) => {
    const repository = new RssFeedRepository(ContextRepository.create(), tx);
    return new DeleteRssFeed(repository).invoke(id);
  });
};
