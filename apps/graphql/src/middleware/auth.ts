import { getContext, ServiceError } from "@getcronit/pylon";
import { createAuth } from "../libs/auth";
import { createDb } from "../libs/drizzle/client";

/**
 * better-auth認証ミドルウェア
 * リクエストのAuthorizationヘッダー(Bearer token)からセッションを検証し、
 * 認証されたユーザー情報をコンテキストに設定する
 *
 * 開発/テスト環境では、X-Test-User-IdヘッダーとX-Test-Keyヘッダーでバイパス可能
 */
const verifyAuth = async () => {
  const ctx = getContext();
  const env = ctx.env as unknown as Record<string, string>;

  // テスト環境でのバイパス
  const testKey = ctx.req.header("X-Test-Key");
  const testUserId = ctx.req.header("X-Test-User-Id");
  if (testKey === env.TEST_AUTH_KEY && testUserId) {
    ctx.set("userId", testUserId);
    return;
  }

  const db = createDb();
  const auth = createAuth(db, {
    GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID ?? "",
    GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET ?? "",
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET ?? "",
    BETTER_AUTH_URL: env.BETTER_AUTH_URL ?? "http://localhost:3000",
  });

  const session = await auth.api.getSession({
    headers: ctx.req.raw.headers,
  });

  if (!session) {
    throw new ServiceError("Unauthorized", {
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  }

  ctx.set("userId", session.user.id);
};

// biome-ignore lint/suspicious/noExplicitAny: 抽象化のためanyを許容
type AnyFunction = (...args: any) => Promise<any>;

export const withAuth =
  <F extends AnyFunction>(fn: F) =>
  async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    await verifyAuth();
    return fn(...args);
  };
