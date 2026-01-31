import type { Config } from "drizzle-kit";

const config = process.env.TURSO_DATABASE_URL ? {
  dialect: "turso" as const,
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
} : { dialect: "sqlite" as const };

export default {
  schema: "./src/libs/drizzle/schema.ts",
  out: "./src/libs/drizzle/migrations",
  ...config,
} satisfies Config;
