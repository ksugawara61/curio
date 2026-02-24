import { ServiceError } from "@getcronit/pylon";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import type { RssArticle } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class GetRssArticles implements BaseApplication<string, RssArticle[]> {
  constructor(
    private readonly feedRepository: IRssFeedRepository,
    private readonly externalRepository: IRssFeedExternalRepository,
  ) {}

  async invoke(id: string): Promise<RssArticle[]> {
    try {
      const feed = await this.feedRepository.findById(id);
      if (!feed) {
        throw new ServiceError("RSS feed not found", {
          statusCode: 404,
          code: "NOT_FOUND",
        });
      }
      return await this.externalRepository.fetchArticles(feed.url);
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw new ServiceError(
        `Failed to fetch RSS articles: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const rssArticles = async (id: string): Promise<RssArticle[]> => {
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  const feedRepository = new RssFeedRepository(userId);
  const externalRepository = new RssFeedExternalRepository();
  return new GetRssArticles(feedRepository, externalRepository).invoke(id);
};
