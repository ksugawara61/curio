import type { Context } from "@getcronit/pylon";
import { getContext } from "@getcronit/pylon";
import { vi } from "vitest";

vi.mock("@getcronit/pylon", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@getcronit/pylon")>();
  return {
    ...actual,
    getContext: vi.fn(),
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

  // getContextをモック
  vi.mocked(getContext).mockReturnValue({
    req: {
      header: (name: string) => {
        if (name === "X-Test-User-Id") return userId;
        if (name === "X-Test-Key") return testKey;
        return undefined;
      },
    },
    env: {
      NODE_ENV: nodeEnv,
      TEST_AUTH_KEY: testKey,
      CLERK_SECRET_KEY: "test-clerk-key",
      SECRET_KEY: "test-secret",
      TURSO_DATABASE_URL: "test-url",
      TURSO_AUTH_TOKEN: "test-token",
    },
    set: vi.fn((key: string, value: unknown) => {
      store.set(key, value);
    }),
    get: vi.fn((key: string) => store.get(key)),
  } as unknown as Context);
};
