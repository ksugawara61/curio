import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").unique().notNull(),
  description: text("description"),
  note: text("note"),
  thumbnail: text("thumbnail"),
  created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

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
  (table) => ({
    pk: primaryKey({ columns: [table.bookmark_id, table.tag_id] }),
  }),
);

export type InsertBookmark = typeof bookmarks.$inferInsert;
export type SelectBookmark = typeof bookmarks.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
export type InsertBookmarkTag = typeof bookmarkTags.$inferInsert;
export type SelectBookmarkTag = typeof bookmarkTags.$inferSelect;
