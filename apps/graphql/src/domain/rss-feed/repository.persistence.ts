import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import type { ContextRepository } from "../../shared/context";
import type { DrizzleDb, Transaction } from "../../shared/drizzle";
import type { CreateRssFeedInput, RssFeed, RssFeedBatchItem } from "./model";
import { rssFeeds } from "./schema";

export class RssFeedRepository {
  private db: DrizzleDb | Transaction;
  private contextRepository: ContextRepository;

  constructor(
    contextRepository: ContextRepository,
    dbOrTx: DrizzleDb | Transaction,
  ) {
    this.contextRepository = contextRepository;
    this.db = dbOrTx;
  }

  async findAllForBatch(): Promise<RssFeedBatchItem[]> {
    return this.db
      .select({
        id: rssFeeds.id,
        user_id: rssFeeds.user_id,
        url: rssFeeds.url,
      })
      .from(rssFeeds);
  }

  async findAll(): Promise<RssFeed[]> {
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(eq(rssFeeds.user_id, userId))
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
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(and(eq(rssFeeds.id, id), eq(rssFeeds.user_id, userId)))
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
    const userId = this.contextRepository.getUserId();
    const result = await this.db
      .select()
      .from(rssFeeds)
      .where(and(eq(rssFeeds.url, url), eq(rssFeeds.user_id, userId)))
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

    const userId = this.contextRepository.getUserId();
    const [feed] = await this.db
      .insert(rssFeeds)
      .values({
        id: createId(),
        user_id: userId,
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

    const userId = this.contextRepository.getUserId();
    await this.db
      .delete(rssFeeds)
      .where(and(eq(rssFeeds.id, id), eq(rssFeeds.user_id, userId)));
  }
}
