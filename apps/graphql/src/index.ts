import { app } from "@getcronit/pylon";
import { createAuth } from "./libs/auth";
import { createDb } from "./libs/drizzle/client";
import { server } from "./server";

// to opt-out pylon telemetry data
// ref: https://pylon.cronit.io/docs/telemetry
process.env.PYLON_TELEMETRY_DISABLED = "1";

export const graphql = server;

// Mount better-auth handler
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  const db = createDb();
  const env = c.env as unknown as Record<string, string>;
  const auth = createAuth(db, {
    GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET ?? "",
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
  });
  return auth.handler(c.req.raw);
});

export default app;
