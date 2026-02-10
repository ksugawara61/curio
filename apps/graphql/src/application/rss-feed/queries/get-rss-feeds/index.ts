import { ServiceError } from "@getcronit/pylon";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";

export const rssFeeds = async (): Promise<RssFeed[]> => {
  try {
    const { getUserId } = ContextRepository.create();
    const userId = getUserId();
    const repository = new RssFeedRepository(userId);
    return await repository.findAll();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch RSS feeds: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
