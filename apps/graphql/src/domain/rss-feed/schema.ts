import { sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const rssFeeds = sqliteTable(
  "rss_feeds",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => [unique().on(table.user_id, table.url)],
);

export type InsertRssFeed = typeof rssFeeds.$inferInsert;
export type SelectRssFeed = typeof rssFeeds.$inferSelect;
