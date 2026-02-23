import { createId } from "@paralleldrive/cuid2";
import { and, eq, gte, sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { articles } from "../../libs/drizzle/schema";
import type {
  GetRecentArticlesInput,
  PersistedArticle,
  UpsertArticleInput,
} from "./model";

export class ArticlePersistenceRepository {
  private db: LibSQLDatabase<typeof schema>;

  constructor(db?: LibSQLDatabase<typeof schema>) {
    this.db = db ?? createDb();
  }

  async findManyWithinPeriod(
    userId: string,
    input: GetRecentArticlesInput,
  ): Promise<PersistedArticle[]> {
    const { hours } = input;
    const threshold = new Date(
      Date.now() - hours * 60 * 60 * 1000,
    ).toISOString();

    const result = await this.db
      .select()
      .from(articles)
      .where(
        and(eq(articles.user_id, userId), gte(articles.created_at, threshold)),
      )
      .orderBy(sql`${articles.created_at} desc`);

    return result.map((row) => ({
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
    }));
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
