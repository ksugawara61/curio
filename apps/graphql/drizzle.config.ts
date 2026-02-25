import type { Config } from "drizzle-kit";

const config = process.env.TURSO_AUTH_TOKEN
  ? {
      dialect: "turso" as const,
      dbCredentials: {
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      },
    }
  : {
      dialect: "sqlite" as const,
      dbCredentials: {
        url: process.env.TURSO_DATABASE_URL,
      },
    };

export default {
  schema: "./src/shared/drizzle/schema.ts",
  out: "./src/shared/drizzle/migrations",
  ...config,
} satisfies Config;
