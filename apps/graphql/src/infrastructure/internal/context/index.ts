import { getContext } from "@getcronit/pylon";

/**
 * 認証済みユーザーのIDをコンテキストから取得するリポジトリ
 * withAuth内で呼び出されることを前提とする
 */
export class ContextRepository {
  getUserId(): string {
    const ctx = getContext();
    const userId = ctx.get("userId");
    if (!userId) {
      throw new Error("User ID not found in context");
    }
    return userId as string;
  }
}
