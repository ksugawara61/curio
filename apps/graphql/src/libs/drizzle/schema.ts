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
    // Test column for CI migration check - will be removed after verification
    test_ci_column: text("test_ci_column"),
    created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
    updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
  },
  (table) => ({
    uniqueUserUrl: unique().on(table.user_id, table.url),
  }),
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
  (table) => ({
    uniqueUserName: unique().on(table.user_id, table.name),
  }),
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
