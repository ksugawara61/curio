import type { Context } from "@getcronit/pylon";
import { getContext, getEnv } from "@getcronit/pylon";
import { vi } from "vitest";

vi.mock("@getcronit/pylon", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@getcronit/pylon")>();
  return {
    ...actual,
    getContext: vi.fn(),
    getEnv: vi.fn(),
  };
});

type MockAuthContextOptions = {
  userId?: string;
  testKey?: string;
  nodeEnv?: string;
};

/**
 * テスト環境で認証をモックするためのヘルパー関数
 */
export const mockAuthContext = (options?: MockAuthContextOptions): void => {
  const userId = options?.userId || "test-user";
  const testKey = options?.testKey || "test-key";
  const nodeEnv = options?.nodeEnv || "test";

  // コンテキストの値を保持するストア（userIdを事前設定）
  const store = new Map<string, unknown>([["userId", userId]]);

  const env = {
    NODE_ENV: nodeEnv,
    TEST_AUTH_KEY: testKey,
    CLERK_SECRET_KEY: "test-clerk-key",
    SECRET_KEY: "test-secret",
    TURSO_DATABASE_URL:
      process.env.TURSO_DATABASE_URL ?? "file:./test-database.db",
    TURSO_AUTH_TOKEN: "test-token",
  };

  // getContextをモック
  vi.mocked(getContext).mockReturnValue({
    req: {
      header: (name: string) => {
        if (name === "X-Test-User-Id") return userId;
        if (name === "X-Test-Key") return testKey;
        return undefined;
      },
    },
    env,
    set: vi.fn((key: string, value: unknown) => {
      store.set(key, value);
    }),
    get: vi.fn((key: string) => store.get(key)),
  } as unknown as Context);

  // getEnvをモック（batch など env 引数を使うケース向け）
  vi.mocked(getEnv).mockReturnValue(env as ReturnType<typeof getEnv>);
};
