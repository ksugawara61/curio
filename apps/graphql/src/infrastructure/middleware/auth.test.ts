import type { Context } from "@getcronit/pylon";
import { getContext } from "@getcronit/pylon";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { withAuth } from "./auth";

vi.mock("@getcronit/pylon", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@getcronit/pylon")>();
  return {
    ...actual,
    getContext: vi.fn(),
  };
});

vi.mock("@clerk/backend", () => ({
  verifyToken: vi.fn(),
}));

import { verifyToken } from "@clerk/backend";

type MockHeaders = Record<string, string | undefined>;

const createMockContext = (
  headers: MockHeaders = {},
  env: Partial<Context["env"]> = {},
) => {
  const setFn = vi.fn();
  const ctx = {
    req: {
      header: (name: string) => headers[name],
    },
    env: {
      NODE_ENV: "test",
      TEST_AUTH_KEY: "test-key",
      CLERK_SECRET_KEY: "clerk-secret",
      SECRET_KEY: "secret",
      TURSO_DATABASE_URL: "test-url",
      TURSO_AUTH_TOKEN: "test-token",
      ...env,
    },
    set: setFn,
  } as unknown as Context;

  vi.mocked(getContext).mockReturnValue(ctx);
  return { ctx, setFn };
};

describe("withAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("テスト用認証キーによるバイパス", () => {
    it("X-Test-Keyが一致する場合、X-Test-User-IdをuserIdに設定する", async () => {
      const { setFn } = createMockContext({
        "X-Test-Key": "test-key",
        "X-Test-User-Id": "custom-user",
      });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);
      await wrapped();

      expect(setFn).toHaveBeenCalledWith("userId", "custom-user");
      expect(fn).toHaveBeenCalled();
    });

    it("X-Test-User-Idが未指定の場合、デフォルトの'test-user'を使用する", async () => {
      const { setFn } = createMockContext({
        "X-Test-Key": "test-key",
      });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);
      await wrapped();

      expect(setFn).toHaveBeenCalledWith("userId", "test-user");
    });

    it("X-Test-Keyが不一致の場合、バイパスしない", async () => {
      createMockContext({
        "X-Test-Key": "wrong-key",
      });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow(
        "Authorization header with Bearer token is required",
      );
    });

    it("NODE_ENVがproductionの場合、テストキーバイパスは無効", async () => {
      createMockContext(
        {
          "X-Test-Key": "test-key",
          "X-Test-User-Id": "custom-user",
        },
        { NODE_ENV: "production" },
      );

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow(
        "Authorization header with Bearer token is required",
      );
    });
  });

  describe("Clerk Bearerトークン検証", () => {
    it("有効なBearerトークンの場合、subをuserIdに設定する", async () => {
      const { setFn } = createMockContext(
        {
          Authorization: "Bearer valid-token",
        },
        { NODE_ENV: "production", TEST_AUTH_KEY: undefined },
      );

      (verifyToken as Mock).mockResolvedValue({ sub: "user_clerk123" });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);
      await wrapped();

      expect(verifyToken).toHaveBeenCalledWith("valid-token", {
        secretKey: "clerk-secret",
      });
      expect(setFn).toHaveBeenCalledWith("userId", "user_clerk123");
      expect(fn).toHaveBeenCalled();
    });

    it("Authorizationヘッダーがない場合、エラーをスローする", async () => {
      createMockContext(
        {},
        { NODE_ENV: "production", TEST_AUTH_KEY: undefined },
      );

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow(
        "Authorization header with Bearer token is required",
      );
      expect(fn).not.toHaveBeenCalled();
    });

    it("Bearerプレフィックスがない場合、エラーをスローする", async () => {
      createMockContext(
        { Authorization: "Basic invalid" },
        { NODE_ENV: "production", TEST_AUTH_KEY: undefined },
      );

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow(
        "Authorization header with Bearer token is required",
      );
    });

    it("トークンにsubが含まれない場合、エラーをスローする", async () => {
      createMockContext(
        { Authorization: "Bearer no-sub-token" },
        { NODE_ENV: "production", TEST_AUTH_KEY: undefined },
      );

      (verifyToken as Mock).mockResolvedValue({ sub: undefined });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow(
        "Invalid token: missing subject claim",
      );
    });

    it("verifyTokenが失敗した場合、エラーが伝播する", async () => {
      createMockContext(
        { Authorization: "Bearer expired-token" },
        { NODE_ENV: "production", TEST_AUTH_KEY: undefined },
      );

      (verifyToken as Mock).mockRejectedValue(new Error("Token has expired"));

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);

      await expect(wrapped()).rejects.toThrow("Token has expired");
    });
  });

  describe("withAuth wrapper", () => {
    it("認証成功後にラップされた関数を引数付きで呼び出す", async () => {
      createMockContext({ "X-Test-Key": "test-key" });

      const fn = vi.fn().mockResolvedValue("result");
      const wrapped = withAuth(fn);
      const result = await wrapped("arg1", "arg2");

      expect(fn).toHaveBeenCalledWith("arg1", "arg2");
      expect(result).toBe("result");
    });
  });
});
