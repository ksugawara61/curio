import type { Context } from "@getcronit/pylon";
import { betterAuth } from "better-auth";

export const authorize = (ctx: Context) => {
  const auth = betterAuth({
    baseURL: ctx.env.BETTER_AUTH_BASE_URL,
    trustedOrigins: ["chrome-extension://*"],
    socialProviders: {
      github: {
        clientId: ctx.env.BETTER_AUTH_CLIENT_ID,
        clientSecret: ctx.env.BETTER_AUTH_CLIENT_SECRET,
      },
    },
  });

  return auth.handler(ctx.req.raw);
};
