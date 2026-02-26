import { ServiceError } from "@getcronit/pylon";
import type { IArticleExternalRepository } from "../../../../domain/article/interface";
import type {
  Article,
  ArticleSource,
  PersistedArticle,
  QiitaArticle,
} from "../../../../domain/article/model";
import { ArticleExternalRepository } from "../../../../domain/article/repository.external";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import type { RssArticle } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

export type GetArticlesInput = {
  source: ArticleSource;
  // Qiita-specific
  offset?: number;
  limit?: number;
  // Database-specific
  hours?: number;
  // RSS-specific
  feedId?: string;
};

const mapQiitaArticle = (item: QiitaArticle): Article => ({
  id: item.id,
  title: item.title,
  url: item.url,
  body: item.body,
  author: item.user.name ?? null,
  tags: item.tags.map((t) => t.name),
  created_at: item.created_at,
  updated_at: item.updated_at,
  source: "qiita",
});

const mapPersistedArticle = (item: PersistedArticle): Article => ({
  id: item.id,
  title: item.title,
  url: item.url,
  description: item.description ?? null,
  thumbnail_url: item.thumbnail_url ?? null,
  pub_date: item.pub_date ?? null,
  read_at: item.read_at ? item.read_at.toISOString() : null,
  created_at: item.created_at.toISOString(),
  updated_at: item.updated_at.toISOString(),
  source: "database",
});

const mapRssArticle = (item: RssArticle): Article => ({
  title: item.title,
  url: item.link,
  description: item.description ?? null,
  thumbnail_url: item.thumbnailUrl ?? null,
  pub_date: item.pubDate ?? null,
  source: "rss",
});

const getQiitaArticles = async (
  input: GetArticlesInput,
  repository: IArticleExternalRepository,
): Promise<Article[]> => {
  const items = await repository.fetchArticles(
    input.offset ?? 0,
    input.limit ?? 20,
  );
  return items.map(mapQiitaArticle);
};

const getDatabaseArticles = async (
  input: GetArticlesInput,
  contextRepository: ContextRepository,
): Promise<Article[]> => {
  const repository = new ArticlePersistenceRepository(
    DrizzleRepository.create().getDb(),
  );
  const userId = contextRepository.getUserId();
  const items = await repository.findManyWithinPeriod(userId, {
    hours: input.hours ?? 48,
  });
  return items.map(mapPersistedArticle);
};

const getRssArticles = async (
  input: GetArticlesInput,
  feedRepository: IRssFeedRepository,
  externalRepository: IRssFeedExternalRepository,
): Promise<Article[]> => {
  if (!input.feedId) {
    throw new ServiceError("feedId is required when source is rss", {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }
  const feed = await feedRepository.findById(input.feedId);
  if (!feed) {
    throw new ServiceError("RSS feed not found", {
      statusCode: 404,
      code: "NOT_FOUND",
    });
  }
  const items = await externalRepository.fetchArticles(feed.url);
  return items.map(mapRssArticle);
};

export const articles = async (input: GetArticlesInput): Promise<Article[]> => {
  try {
    switch (input.source) {
      case "qiita": {
        const repository = new ArticleExternalRepository();
        return await getQiitaArticles(input, repository);
      }
      case "database": {
        return await getDatabaseArticles(input, ContextRepository.create());
      }
      case "rss": {
        const feedRepository = new RssFeedRepository(
          ContextRepository.create(),
          DrizzleRepository.create().getDb(),
        );
        const externalRepository = new RssFeedExternalRepository();
        return await getRssArticles(input, feedRepository, externalRepository);
      }
      default: {
        const _exhaustive: never = input.source;
        throw new ServiceError(`Unknown article source: ${_exhaustive}`, {
          statusCode: 400,
          code: "BAD_REQUEST",
        });
      }
    }
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      `Failed to fetch articles: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
