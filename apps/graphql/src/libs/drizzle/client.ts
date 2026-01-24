import { getEnv } from "@getcronit/pylon";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

let db: LibSQLDatabase<typeof schema>;

export const createDb = () => {
  if (db) {
    return db;
  }

  const tursoClient = createClient({
    url: getEnv().TURSO_DATABASE_URL ?? "file:./local.db",
    authToken: getEnv().TURSO_AUTH_TOKEN,
  });
  db = drizzle(tursoClient, { schema });
  return db;
};
