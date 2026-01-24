import { sql } from "drizzle-orm";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { createDb } from "../drizzle/client";
import { mockAuthContext } from "./authHelper";
import { mockServer } from "./mockServer";

const clearAllTables = async () => {
  const db = createDb();
  const tables = await db.all<{ name: string }>(
    sql`SELECT name FROM sqlite_master WHERE type='table'`,
  );

  const tableNames = tables
    .filter((table) => table.name !== "__drizzle_migrations")
    .map((table) => table.name);

  for (const tableName of tableNames) {
    try {
      await db.run(sql.raw(`DELETE FROM ${tableName}`));
    } catch {
      // Ignore if table doesn't exist or other errors
    }
  }
};

beforeAll(async () => {
  mockServer.listen();
  mockAuthContext();
});

afterEach(async () => {
  mockServer.resetHandlers();
  await clearAllTables();
});

afterAll(async () => {
  mockServer.close();
  vi.restoreAllMocks();
});
