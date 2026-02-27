import { ServiceError } from "@getcronit/pylon";
import type { IRssFeedRepository } from "../../../../domain/rss-feed/interface";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";

const getRssFeedsUseCase = async ({
  repository,
}: {
  repository: IRssFeedRepository;
}): Promise<RssFeed[]> => {
  try {
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

export const rssFeeds = async (): Promise<RssFeed[]> => {
  const repository = RssFeedRepository.create();
  return getRssFeedsUseCase({ repository });
};
