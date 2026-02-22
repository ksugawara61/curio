import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { rssFeeds } from "../../libs/drizzle/schema";
import type { IRssFeedBatchRepository } from "./interface";
import type { RssFeedBatchItem } from "./model";

export class RssFeedBatchRepository implements IRssFeedBatchRepository {
  private db: LibSQLDatabase<typeof schema>;

  constructor(db?: LibSQLDatabase<typeof schema>) {
    this.db = db ?? createDb();
  }

  async findAll(): Promise<RssFeedBatchItem[]> {
    const result = await this.db
      .select({
        id: rssFeeds.id,
        user_id: rssFeeds.user_id,
        url: rssFeeds.url,
      })
      .from(rssFeeds);

    return result;
  }
}
