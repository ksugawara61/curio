import { ServiceError } from "@getcronit/pylon";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import type { RssArticle } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

const getRssArticlesUseCase = async (
  id: string,
  {
    feedRepository,
    externalRepository,
  }: {
    feedRepository: IRssFeedRepository;
    externalRepository: IRssFeedExternalRepository;
  },
): Promise<RssArticle[]> => {
  try {
    const feed = await feedRepository.findById(id);
    if (!feed) {
      throw new ServiceError("RSS feed not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
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

export const rssArticles = async (id: string): Promise<RssArticle[]> => {
  const feedRepository = new RssFeedRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  const externalRepository = new RssFeedExternalRepository();
  return getRssArticlesUseCase(id, { feedRepository, externalRepository });
};
