import { ServiceError } from "@getcronit/pylon";
import type { IRssFeedRepository } from "../../../../domain/rss-feed/interface";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";

const deleteRssFeedUseCase = async (
  id: string,
  { repository }: { repository: IRssFeedRepository },
): Promise<boolean> => {
  try {
    await repository.remove(id);
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
};

export const deleteRssFeed = async (id: string): Promise<boolean> => {
  return RssFeedRepository.withTransaction(async (repository) =>
    deleteRssFeedUseCase(id, { repository }),
  );
};
