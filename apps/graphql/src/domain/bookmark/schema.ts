import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { tags } from "../tag/schema";

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

export type InsertBookmark = typeof bookmarks.$inferInsert;
export type SelectBookmark = typeof bookmarks.$inferSelect;
export type InsertBookmarkTag = typeof bookmarkTags.$inferInsert;
export type SelectBookmarkTag = typeof bookmarkTags.$inferSelect;
