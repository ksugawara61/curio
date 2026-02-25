import { getEnv } from "@getcronit/pylon";
import { createClient } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

/** スキーマ付きのデータベース型 */
export type DrizzleDb = LibSQLDatabase<typeof schema>;
export type Transaction = Parameters<
  Parameters<DrizzleDb["transaction"]>[0]
>[0];

/**
 * データベース接続を管理するリポジトリ
 * ContextRepository同様にシングルトンパターンで管理する
 */
export class DrizzleRepository {
  private static instance: DrizzleRepository | null = null;
  private readonly db: DrizzleDb;

  private constructor(env?: ReturnType<typeof getEnv>) {
    const resolvedEnv = env ?? getEnv();
    const tursoClient = createClient({
      url: resolvedEnv.TURSO_DATABASE_URL ?? "file:./local.db",
      authToken: resolvedEnv.TURSO_AUTH_TOKEN,
    });
    this.db = drizzle(tursoClient, { schema });
  }

  static create(env?: ReturnType<typeof getEnv>): DrizzleRepository {
    if (!DrizzleRepository.instance) {
      DrizzleRepository.instance = new DrizzleRepository(env);
    }
    return DrizzleRepository.instance;
  }

  getDb(): DrizzleDb {
    return this.db;
  }

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    return this.db.transaction(fn);
  }
}
