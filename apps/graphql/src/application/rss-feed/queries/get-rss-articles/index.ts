import { ServiceError } from "@getcronit/pylon";
import type { RssArticle } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";

export const rssArticles = async (id: string): Promise<RssArticle[]> => {
  try {
    const { getUserId } = ContextRepository.create();
    const userId = getUserId();
    const feedRepository = new RssFeedRepository(userId);

    const feed = await feedRepository.findById(id);
    if (!feed) {
      throw new ServiceError("RSS feed not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }

    const externalRepository = new RssFeedExternalRepository();
    return await externalRepository.fetchArticles(feed.url);
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
};
