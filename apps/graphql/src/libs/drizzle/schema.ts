import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// better-auth tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

// application tables
export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").unique().notNull(),
  description: text("description"),
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
