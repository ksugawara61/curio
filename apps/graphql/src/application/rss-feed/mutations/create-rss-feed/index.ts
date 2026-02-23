import { ServiceError } from "@getcronit/pylon";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import type { RssFeed } from "../../../../domain/rss-feed/model";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import { fetchAndValidateRssFeed, rssFeedUrlSchema } from "./validate";

export const createRssFeed = async (url: string): Promise<RssFeed> => {
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

  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();

  let feed: RssFeed;
  try {
    feed = await db.transaction(async (tx) => {
      const repository = new RssFeedRepository(userId, tx);
      return await repository.create({
        url: urlResult.data,
        title: meta.title,
        description: meta.description,
      });
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

  try {
    const externalRepo = new RssFeedExternalRepository();
    const rssArticles = await externalRepo.fetchArticles(feed.url);
    const articleRepo = new ArticlePersistenceRepository(db);

    for (const article of rssArticles) {
      if (!article.link) continue;

      await articleRepo.upsert({
        user_id: userId,
        rss_feed_id: feed.id,
        title: article.title,
        url: article.link,
        description: article.description,
        thumbnail_url: article.thumbnailUrl,
        pub_date: article.pubDate,
      });
    }
  } catch (error) {
    console.error(
      `[createRssFeed] Failed to save initial articles for feed: ${feed.url}`,
      error,
    );
  }

  return feed;
};
