import { createSWRHandler } from "@curio/testing-library";
import { STORAGE_KEY } from "./useBlockedDomains";

/**
 * SWR mock handlers for useBlockedDomains hook
 * MSW handlers と同様のパターンで SWR モックを定義
 */
export const BlockedDomainsMocks = {
  Empty: createSWRHandler(STORAGE_KEY, [] as string[]),
  WithDomains: createSWRHandler(STORAGE_KEY, ["example.com", "test.com"]),
};
