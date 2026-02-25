import { sql } from "drizzle-orm";
import { sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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

export type InsertTag = typeof tags.$inferInsert;
export type SelectTag = typeof tags.$inferSelect;
