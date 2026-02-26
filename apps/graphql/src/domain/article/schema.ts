import { sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { rssFeeds } from "../rss-feed/schema";

export const articles = sqliteTable(
  "articles",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull(),
    rss_feed_id: text("rss_feed_id")
      .notNull()
      .references(() => rssFeeds.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    thumbnail_url: text("thumbnail_url"),
    pub_date: text("pub_date"),
    read_at: text("read_at"),
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => [unique().on(table.rss_feed_id, table.url)],
);

export type InsertArticle = typeof articles.$inferInsert;
export type SelectArticle = typeof articles.$inferSelect;
