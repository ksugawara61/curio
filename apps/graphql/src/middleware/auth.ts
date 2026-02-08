import { verifyToken } from "@clerk/backend";
import { getContext } from "@getcronit/pylon";
import { ContextRepository } from "../infrastructure/internal/context";

/**
 * テスト用認証キーによるバイパスを試行する
 * NODE_ENVがproductionの場合はバイパス不可
 */
const tryTestKeyAuth = (
  testKey: string | undefined,
  testAuthKey: string | undefined,
  testUserId: string | undefined,
  nodeEnv: string | undefined,
): string | null => {
  if (nodeEnv === "production") return null;
  if (!testKey || !testAuthKey) return null;
  if (testKey !== testAuthKey) return null;
  return testUserId || "test-user";
};

/**
 * AuthorizationヘッダーからBearerトークンを抽出する
 */
const extractBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
};

/**
 * Clerk認証ミドルウェア
 * リクエストのAuthorizationヘッダーからトークンを検証し、認証されたユーザー情報をコンテキストに設定する
 *
 * 開発/テスト環境では、X-Test-User-IdヘッダーとX-Test-Keyヘッダーでバイパス可能
 */
const verifyAuth = async () => {
  const ctx = getContext();

  // テスト用認証キーによるバイパス
  const testUserId = tryTestKeyAuth(
    ctx.req.header("X-Test-Key"),
    ctx.env.TEST_AUTH_KEY,
    ctx.req.header("X-Test-User-Id"),
    ctx.env.NODE_ENV,
  );
  if (testUserId) {
    const contextRepository = ContextRepository.create();
    contextRepository.setUserId(testUserId);
    return;
  }

  // AuthorizationヘッダーからBearerトークンを抽出
  const token = extractBearerToken(ctx.req.header("Authorization"));
  if (!token) {
    throw new Error("Authorization header with Bearer token is required");
  }

  // Clerkトークンを検証
  const payload = await verifyToken(token, {
    secretKey: ctx.env.CLERK_SECRET_KEY,
  });

  if (!payload.sub) {
    throw new Error("Invalid token: missing subject claim");
  }

  const contextRepository = ContextRepository.create();
  contextRepository.setUserId(payload.sub);
};

// biome-ignore lint/suspicious/noExplicitAny: 抽象化のためanyを許容
type AnyFunction = (...args: any) => Promise<any>;

export const withAuth =
  <F extends AnyFunction>(fn: F) =>
  async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    await verifyAuth();
    return fn(...args);
  };
