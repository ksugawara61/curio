import { ServiceError } from "@getcronit/pylon";
import type { IRssFeedRepository } from "../../../../domain/rss-feed/interface";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class GetRssFeeds implements BaseApplication<void, RssFeed[]> {
  constructor(private readonly repository: IRssFeedRepository) {}

  async invoke(): Promise<RssFeed[]> {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch RSS feeds: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const rssFeeds = async (): Promise<RssFeed[]> => {
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  const repository = new RssFeedRepository(userId);
  return new GetRssFeeds(repository).invoke();
};
