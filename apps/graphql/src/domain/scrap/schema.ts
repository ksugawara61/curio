import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { bookmarks } from "../bookmark/schema";

export const scraps = sqliteTable("scraps", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  created_at: text("created_at").default(sql`(datetime('now'))`).notNull(),
  updated_at: text("updated_at").default(sql`(datetime('now'))`).notNull(),
});

export const scrapBookmarks = sqliteTable(
  "scrap_bookmarks",
  {
    scrap_id: text("scrap_id")
      .notNull()
      .references(() => scraps.id, { onDelete: "cascade" }),
    bookmark_id: text("bookmark_id")
      .notNull()
      .references(() => bookmarks.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.scrap_id, table.bookmark_id] })],
);

export type InsertScrap = typeof scraps.$inferInsert;
export type SelectScrap = typeof scraps.$inferSelect;
export type InsertScrapBookmark = typeof scrapBookmarks.$inferInsert;
export type SelectScrapBookmark = typeof scrapBookmarks.$inferSelect;
