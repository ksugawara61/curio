import { ServiceError } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import { fetchAndValidateRssFeed, rssFeedUrlSchema } from "./validate";

const createRssFeedUseCase = async (
  url: string,
  { repository }: { repository: IRssFeedRepository },
): Promise<RssFeed> => {
  const urlResult = rssFeedUrlSchema.safeParse(url);
  if (!urlResult.success) {
    throw new ServiceError(urlResult.error.errors[0].message, {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }

  let meta: { title: string; description?: string };
  try {
    meta = await fetchAndValidateRssFeed(urlResult.data);
  } catch (error) {
    throw new ServiceError(
      `Invalid RSS feed URL: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 400,
        code: "BAD_REQUEST",
      },
    );
  }

  try {
    return await repository.create({
      url: urlResult.data,
      title: meta.title,
      description: meta.description,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("is already registered")
    ) {
      throw new ServiceError(error.message, {
        statusCode: 409,
        code: "CONFLICT",
      });
    }
    throw new ServiceError(
      `Failed to create RSS feed: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};

/**
 * フィード作成後に記事を初期同期する関数。
 * createRssFeedUseCase のトランザクション完了後にベストエフォートで実行するため、意図的に分離している。
 * 失敗してもフィード作成自体はロールバックしない。
 */
const syncRssFeedArticlesUseCase = async (
  feed: RssFeed,
  {
    externalRepository,
    articleRepository,
    contextRepository,
  }: {
    externalRepository: IRssFeedExternalRepository;
    articleRepository: IArticlePersistenceRepository;
    contextRepository: ContextRepository;
  },
): Promise<void> => {
  const userId = contextRepository.getUserId();
  const rssArticles = await externalRepository.fetchArticles(feed.url);
  for (const article of rssArticles) {
    if (!article.link) continue;
    await articleRepository.upsert({
      user_id: userId,
      rss_feed_id: feed.id,
      title: article.title,
      url: article.link,
      description: article.description,
      thumbnail_url: article.thumbnailUrl,
      pub_date: article.pubDate,
    });
  }
};

export const createRssFeed = async (url: string): Promise<RssFeed> => {
  const drizzle = DrizzleRepository.create();
  const contextRepository = ContextRepository.create();

  // Phase 1: フィード作成をトランザクション内で実行
  const feed = await drizzle.transaction(async (tx) => {
    const repository = new RssFeedRepository(contextRepository, tx);
    return createRssFeedUseCase(url, { repository });
  });

  // Phase 2: 記事の初期同期はトランザクション外でベストエフォート実行
  // 失敗してもフィード作成自体は成功扱いにするため、意図的に分離している
  try {
    await syncRssFeedArticlesUseCase(feed, {
      externalRepository: new RssFeedExternalRepository(),
      articleRepository: new ArticlePersistenceRepository(
        contextRepository,
        drizzle.getDb(),
      ),
      contextRepository,
    });
  } catch (error) {
    console.error(
      `[createRssFeed] Failed to save initial articles for feed: ${feed.url}`,
      error,
    );
  }

  return feed;
};
