import { STORAGE_KEY } from "./useBlockedDomains";

/**
 * SWR fallback mocks for useBlockedDomains hook
 * テストで Suspense の警告を防ぐために SWRConfig の fallback として使用する
 */
export const BlockedDomainsMocks = {
  Empty: { [STORAGE_KEY]: [] },
  WithDomains: { [STORAGE_KEY]: ["example.com", "test.com"] },
} as const satisfies Record<string, Record<string, string[]>>;
