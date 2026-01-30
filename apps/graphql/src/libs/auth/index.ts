import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type * as schema from "../drizzle/schema";

export const createAuth = (
  db: LibSQLDatabase<typeof schema>,
  env: {
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  },
) => {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    plugins: [bearer()],
    trustedOrigins: ["*"],
  });
};

export type Auth = ReturnType<typeof createAuth>;
