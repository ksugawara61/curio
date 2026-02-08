import { getContext } from "@getcronit/pylon";

/**
 * 認証済みユーザーのIDをコンテキストから取得・設定するリポジトリ
 * getUserIdはwithAuth内で呼び出されることを前提とする
 */
export class ContextRepository {
  private static instance: ContextRepository | null = null;

  private constructor() {}

  static create(): ContextRepository {
    if (!ContextRepository.instance) {
      ContextRepository.instance = new ContextRepository();
    }
    return ContextRepository.instance;
  }

  getUserId(): string {
    const ctx = getContext();
    const userId = ctx.get("userId");
    if (!userId) {
      throw new Error("User ID not found in context");
    }
    return userId as string;
  }

  setUserId(userId: string): void {
    const ctx = getContext();
    ctx.set("userId", userId);
  }
}
