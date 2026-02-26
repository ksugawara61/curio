import { createId } from "@paralleldrive/cuid2";
import { and, eq, inArray, sql } from "drizzle-orm";
import { ContextRepository } from "../../shared/context";
import {
  type DrizzleDb,
  DrizzleRepository,
  type Transaction,
} from "../../shared/drizzle";
import { rssFeeds } from "../rss-feed/schema";
import type { GetRecentArticlesInput, UpsertArticleInput } from "./interface";
import type { PersistedArticle } from "./model";
import { articles } from "./schema";

export class ArticlePersistenceRepository {
  private contextRepository: ContextRepository;
  private db: DrizzleDb | Transaction;

  constructor(
    contextRepository: ContextRepository,
    db: DrizzleDb | Transaction,
  ) {
    this.contextRepository = contextRepository;
    this.db = db;
  }

  async findManyWithinPeriod(
    input: GetRecentArticlesInput,
  ): Promise<PersistedArticle[]> {
    const { hours } = input;
    const threshold = new Date(Date.now() - hours * 60 * 60 * 1000);
    const userId = this.contextRepository.getUserId();

    const result = await this.db
      .select({
        id: articles.id,
        rss_feed_id: articles.rss_feed_id,
        title: articles.title,
        url: articles.url,
        description: articles.description,
        thumbnail_url: articles.thumbnail_url,
        pub_date: articles.pub_date,
        read_at: articles.read_at,
        created_at: articles.created_at,
        updated_at: articles.updated_at,
      })
      .from(articles)
      .innerJoin(rssFeeds, eq(articles.rss_feed_id, rssFeeds.id))
      .where(eq(rssFeeds.user_id, userId))
      .orderBy(sql`${articles.pub_date} desc`);

    return result
      .map((row) => ({
        id: row.id,
        rss_feed_id: row.rss_feed_id,
        title: row.title,
        url: row.url,
        description: row.description,
        thumbnail_url: row.thumbnail_url,
        pub_date: row.pub_date,
        read_at: row.read_at ? new Date(row.read_at) : null,
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

  async markAsRead(id: string): Promise<PersistedArticle> {
    const userId = this.contextRepository.getUserId();
    const now = new Date().toISOString();
    const validFeedIds = this.db
      .select({ id: rssFeeds.id })
      .from(rssFeeds)
      .where(eq(rssFeeds.user_id, userId));
    const [updated] = await this.db
      .update(articles)
      .set({ read_at: now, updated_at: now })
      .where(
        and(eq(articles.id, id), inArray(articles.rss_feed_id, validFeedIds)),
      )
      .returning();
    if (!updated) {
      throw new Error("No record was found");
    }
    return {
      id: updated.id,
      rss_feed_id: updated.rss_feed_id,
      title: updated.title,
      url: updated.url,
      description: updated.description,
      thumbnail_url: updated.thumbnail_url,
      pub_date: updated.pub_date,
      read_at: updated.read_at ? new Date(updated.read_at) : null,
      created_at: new Date(updated.created_at),
      updated_at: new Date(updated.updated_at),
    };
  }

  static create(
    env?: Parameters<(typeof DrizzleRepository)["create"]>[0],
  ): ArticlePersistenceRepository {
    return new ArticlePersistenceRepository(
      ContextRepository.create(),
      DrizzleRepository.create(env).getDb(),
    );
  }
}
