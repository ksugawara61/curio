import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { articles } from "../../libs/drizzle/schema";
import type { UpsertArticleInput } from "./model";

export class ArticlePersistenceRepository {
  private db: LibSQLDatabase<typeof schema>;

  constructor(db?: LibSQLDatabase<typeof schema>) {
    this.db = db ?? createDb();
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
