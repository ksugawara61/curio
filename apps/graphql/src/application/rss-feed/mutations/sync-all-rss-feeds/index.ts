import type { getEnv } from "@getcronit/pylon";
import type { IArticlePersistenceRepository } from "../../../../domain/article/interface";
import { ArticlePersistenceRepository } from "../../../../domain/article/repository.persistence";
import type {
  IRssFeedExternalRepository,
  IRssFeedRepository,
} from "../../../../domain/rss-feed/interface";
import { RssFeedExternalRepository } from "../../../../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../../../../domain/rss-feed/repository.persistence";

const syncAllRssFeedsUseCase = async ({
  rssFeedRepository,
  externalRepository,
  articleRepository,
}: {
  rssFeedRepository: IRssFeedRepository;
  externalRepository: IRssFeedExternalRepository;
  articleRepository: IArticlePersistenceRepository;
}): Promise<void> => {
  const feeds = await rssFeedRepository.findAllForBatch();

  for (const feed of feeds) {
    try {
      const rssArticles = await externalRepository.fetchArticles(feed.url);

      for (const article of rssArticles) {
        if (!article.link) continue;

        await articleRepository.upsert({
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
};

export const syncAllRssFeeds = async (
  env?: ReturnType<typeof getEnv>,
): Promise<void> => {
  const rssFeedRepository = RssFeedRepository.create(env);
  const externalRepository = new RssFeedExternalRepository();
  const articleRepository = ArticlePersistenceRepository.create(env);
  return syncAllRssFeedsUseCase({
    rssFeedRepository,
    externalRepository,
    articleRepository,
  });
};
