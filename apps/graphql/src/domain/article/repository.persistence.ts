import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "drizzle-orm";
import type { DrizzleDb } from "../../shared/drizzle";
import type {
  GetRecentArticlesInput,
  PersistedArticle,
  UpsertArticleInput,
} from "./model";
import { articles } from "./schema";

export class ArticlePersistenceRepository {
  private db: DrizzleDb;

  constructor(db: DrizzleDb) {
    this.db = db;
  }

  async findManyWithinPeriod(
    userId: string,
    input: GetRecentArticlesInput,
  ): Promise<PersistedArticle[]> {
    const { hours } = input;
    const threshold = new Date(Date.now() - hours * 60 * 60 * 1000);

    const result = await this.db
      .select()
      .from(articles)
      .where(eq(articles.user_id, userId))
      .orderBy(sql`${articles.pub_date} desc`);

    return result
      .map((row) => ({
        id: row.id,
        user_id: row.user_id,
        rss_feed_id: row.rss_feed_id,
        title: row.title,
        url: row.url,
        description: row.description,
        thumbnail_url: row.thumbnail_url,
        pub_date: row.pub_date,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      }))
      .filter((article) => {
        const date =
          article.pub_date !== null && article.pub_date !== undefined
            ? new Date(article.pub_date)
            : article.created_at;
        return !Number.isNaN(date.getTime()) && date >= threshold;
      });
  }

  async upsert(input: UpsertArticleInput): Promise<void> {
    await this.db
      .insert(articles)
      .values({
        id: createId(),
        user_id: input.user_id,
        rss_feed_id: input.rss_feed_id,
        title: input.title,
        url: input.url,
        description: input.description,
        thumbnail_url: input.thumbnail_url,
        pub_date: input.pub_date,
      })
      .onConflictDoUpdate({
        target: [articles.rss_feed_id, articles.url],
        set: {
          title: input.title,
          description: input.description,
          thumbnail_url: input.thumbnail_url,
          pub_date: input.pub_date,
          updated_at: sql`(datetime('now'))`,
        },
      });
  }
}
