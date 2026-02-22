import { ArticlePersistenceRepository } from "../domain/article/repository.persistence";
import { RssFeedBatchRepository } from "../domain/rss-feed/repository.batch";
import { RssFeedExternalRepository } from "../domain/rss-feed/repository.external";

export const scheduled = async (): Promise<void> => {
  const feedRepo = new RssFeedBatchRepository();
  const feeds = await feedRepo.findAll();

  const externalRepo = new RssFeedExternalRepository();
  const articleRepo = new ArticlePersistenceRepository();

  for (const feed of feeds) {
    try {
      const rssArticles = await externalRepo.fetchArticles(feed.url);

      for (const article of rssArticles) {
        if (!article.link) continue;

        await articleRepo.upsert({
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
};
