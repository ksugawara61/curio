import type { getEnv } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";

export class SyncAllRssFeeds {
  constructor(
    private readonly rssFeedRepository: IRssFeedRepository,
    private readonly externalRepository: IRssFeedExternalRepository,
    private readonly articleRepository: IArticlePersistenceRepository,
  ) {}

  async invoke(): Promise<void> {
    const feeds = await this.rssFeedRepository.findAllForBatch();

    for (const feed of feeds) {
      try {
        const rssArticles = await this.externalRepository.fetchArticles(
          feed.url,
        );

        for (const article of rssArticles) {
          if (!article.link) continue;

          await this.articleRepository.upsert({
            user_id: feed.user_id,
            rss_feed_id: feed.id,
            title: article.title,
            url: article.link,
            description: article.description,
            thumbnail_url: article.thumbnailUrl,
            pub_date: article.pubDate,
          });
        }

        console.log(
          `[batch] Fetched ${rssArticles.length} articles from feed: ${feed.url}`,
        );
      } catch (error) {
        console.error(
          `[batch] Failed to fetch articles from feed: ${feed.url}`,
          error,
        );
      }
    }
  }
}

export const syncAllRssFeeds = async (
  env?: ReturnType<typeof getEnv>,
): Promise<void> => {
  const drizzle = DrizzleRepository.create(env);
  const rssFeedRepo = new RssFeedRepository(
    ContextRepository.create(),
    drizzle.getDb(),
  );
  const externalRepo = new RssFeedExternalRepository();
  const articleRepo = new ArticlePersistenceRepository(drizzle.getDb());
  return new SyncAllRssFeeds(rssFeedRepo, externalRepo, articleRepo).invoke();
};
