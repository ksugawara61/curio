import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createDb } from "../../libs/drizzle/client";
import type * as schema from "../../libs/drizzle/schema";
import { rssFeeds } from "../../libs/drizzle/schema";
import type { CreateRssFeedInput, RssFeed, RssFeedBatchItem } from "./model";

type Transaction = Parameters<
  Parameters<LibSQLDatabase<typeof schema>["transaction"]>[0]
>[0];

export class RssFeedRepository {
  private db: LibSQLDatabase<typeof schema> | Transaction;
  private userId: string;

  constructor(
    userId: string,
    dbOrTx?: LibSQLDatabase<typeof schema> | Transaction,
  ) {
    this.userId = userId;
    this.db = dbOrTx ?? createDb();
  }

  static async findAllForBatch(
    db?: LibSQLDatabase<typeof schema>,
  ): Promise<RssFeedBatchItem[]> {
    const database = db ?? createDb();
    return database
      .select({
        id: rssFeeds.id,
        user_id: rssFeeds.user_id,
        url: rssFeeds.url,
      })
      .from(rssFeeds);
  }

  async findAll(): Promise<RssFeed[]> {
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(eq(rssFeeds.user_id, this.userId))
      .orderBy(rssFeeds.created_at);

    return result.map((feed) => ({
      id: feed.id,
      url: feed.url,
      title: feed.title,
      description: feed.description,
      created_at: new Date(feed.created_at),
      updated_at: new Date(feed.updated_at),
    }));
  }

  async findById(id: string): Promise<RssFeed | null> {
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(and(eq(rssFeeds.id, id), eq(rssFeeds.user_id, this.userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const feed = result[0];
    return {
      id: feed.id,
      url: feed.url,
      title: feed.title,
      description: feed.description,
      created_at: new Date(feed.created_at),
      updated_at: new Date(feed.updated_at),
    };
  }

  async findByUrl(url: string): Promise<RssFeed | null> {
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(and(eq(rssFeeds.url, url), eq(rssFeeds.user_id, this.userId)))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const feed = result[0];
    return {
      id: feed.id,
      url: feed.url,
      title: feed.title,
      description: feed.description,
      created_at: new Date(feed.created_at),
      updated_at: new Date(feed.updated_at),
    };
  }

  async create(input: CreateRssFeedInput): Promise<RssFeed> {
    const existing = await this.findByUrl(input.url);
    if (existing) {
      throw new Error(`RSS feed with URL "${input.url}" is already registered`);
    }

    const [feed] = await this.db
      .insert(rssFeeds)
      .values({
        id: createId(),
        user_id: this.userId,
        url: input.url,
        title: input.title,
        description: input.description,
      })
      .returning();

    return {
      id: feed.id,
      url: feed.url,
      title: feed.title,
      description: feed.description,
      created_at: new Date(feed.created_at),
      updated_at: new Date(feed.updated_at),
    };
  }

  async remove(id: string): Promise<void> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error("No record was found");
    }

    await this.db
      .delete(rssFeeds)
      .where(and(eq(rssFeeds.id, id), eq(rssFeeds.user_id, this.userId)));
  }
}
