/**
 * SWR fallback mocks for useBlockedDomains hook
 * テストで Suspense の警告を防ぐために SWRConfig の fallback として使用する
 */
export const BlockedDomainsMocks = {
  Empty: { blockedDomains: [] as string[] },
  WithDomains: (domains: string[]) => ({ blockedDomains: domains }),
} as const;
