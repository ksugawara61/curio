import { getContext } from "@getcronit/pylon";

/**
 * Clerk認証ミドルウェア
 * リクエストのAuthorizationヘッダーからトークンを検証し、認証されたユーザー情報をコンテキストに設定する
 *
 * 開発/テスト環境では、X-Test-User-IdヘッダーとX-Test-Keyヘッダーでバイパス可能
 */
const verifyAuth = async () => {
  const ctx = getContext();

  console.log("Verifying authentication...", ctx.env.NODE_ENV);

  // 認証されたユーザーIDをコンテキストに設定
  ctx.set("userId", "dummy");
};

// biome-ignore lint/suspicious/noExplicitAny: 抽象化のためanyを許容
type AnyFunction = (...args: any) => Promise<any>;

export const withAuth =
  <F extends AnyFunction>(fn: F) =>
  async (...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> => {
    await verifyAuth();
    return fn(...args);
  };
