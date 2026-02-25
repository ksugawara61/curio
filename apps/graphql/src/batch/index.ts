import { ArticlePersistenceRepository } from "../domain/article/repository.persistence";
import { RssFeedExternalRepository } from "../domain/rss-feed/repository.external";
import { RssFeedRepository } from "../domain/rss-feed/repository.persistence";
import { DrizzleRepository } from "../shared/drizzle";

export const scheduled = async (
  _controller?: ScheduledController,
  _env?: unknown,
  _ctx?: ExecutionContext,
): Promise<void> => {
  console.log("[batch] Starting RSS feed fetch batch job...");
  const drizzle = DrizzleRepository.create();
  const feeds = await RssFeedRepository.findAllForBatch(drizzle.getDb());

  const externalRepo = new RssFeedExternalRepository();
  const articleRepo = new ArticlePersistenceRepository(drizzle.getDb());

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

  console.log("[batch] RSS feed fetch batch job completed.");
};
