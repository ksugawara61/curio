import { ServiceError } from "@getcronit/pylon";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";

export const deleteRssFeed = async (id: string): Promise<boolean> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();

  try {
    await db.transaction(async (tx) => {
      const repository = new RssFeedRepository(userId, tx);
      await repository.remove(id);
    });
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
