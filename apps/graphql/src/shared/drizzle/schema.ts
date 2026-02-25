import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull(),
    title: text("title").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    note: text("note"),
    thumbnail: text("thumbnail"),
    archived_at: text("archived_at"),
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => [unique().on(table.user_id, table.url)],
);

export const tags = sqliteTable(
  "tags",
  {
    id: text("id").primaryKey(),
    user_id: text("user_id").notNull(),
    name: text("name").notNull(),
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => [unique().on(table.user_id, table.name)],
);

export const bookmarkTags = sqliteTable(
  "bookmark_tags",
  {
    bookmark_id: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
    tag_id: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.bookmark_id, table.tag_id] })],
);

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
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => [unique().on(table.rss_feed_id, table.url)],
);

export type InsertBookmark = typeof bookmarks.$inferInsert;
export type SelectBookmark = typeof bookmarks.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
export type InsertBookmarkTag = typeof bookmarkTags.$inferInsert;
export type SelectBookmarkTag = typeof bookmarkTags.$inferSelect;
export type InsertRssFeed = typeof rssFeeds.$inferInsert;
export type SelectRssFeed = typeof rssFeeds.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;
export type SelectArticle = typeof articles.$inferSelect;
