import { useCallback } from "react";
import { useSWRSuspense } from "../../libs/swr";

export const STORAGE_KEY = "blockedDomains";

const getBlockedDomains = async (): Promise<string[]> => {
  if (typeof chrome === "undefined" || !chrome.storage) {
    return [];
  }
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as string[] | undefined) ?? [];
};

const setBlockedDomains = async (domains: string[]): Promise<void> => {
  if (typeof chrome === "undefined" || !chrome.storage) {
    return;
  }
  await chrome.storage.local.set({ [STORAGE_KEY]: domains });
};

export const extractDomain = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
};

const matchesEntry = (
  entry: string,
  hostname: string,
  pathname: string,
): boolean => {
  const slashIdx = entry.indexOf("/");
  if (slashIdx === -1) {
    // Domain-only entry: exact match or subdomain match
    return hostname === entry || hostname.endsWith(`.${entry}`);
  }
  // Domain+path entry
  const entryDomain = entry.substring(0, slashIdx);
  const entryPath = entry.substring(slashIdx); // includes leading /
  const domainMatches =
    hostname === entryDomain || hostname.endsWith(`.${entryDomain}`);
  const pathMatches =
    pathname === entryPath || pathname.startsWith(`${entryPath}/`);
  return domainMatches && pathMatches;
};

export const useBlockedDomains = () => {
  const { data: domains, mutate } = useSWRSuspense<string[]>(
    STORAGE_KEY,
    getBlockedDomains,
  );

  const addDomain = useCallback(
    async (domain: string) => {
      const trimmed = domain.trim().toLowerCase();
      if (!trimmed || domains.includes(trimmed)) return;
      const updated = [...domains, trimmed];
      await setBlockedDomains(updated);
      mutate(updated, false);
    },
    [domains, mutate],
  );

  const removeDomain = useCallback(
    async (domain: string) => {
      const updated = domains.filter((d) => d !== domain);
      await setBlockedDomains(updated);
      mutate(updated, false);
    },
    [domains, mutate],
  );

  const isDomainBlocked = useCallback(
    (url: string): boolean => {
      try {
        const { hostname, pathname } = new URL(url);
        if (!hostname) return false;
        return domains.some((entry) => matchesEntry(entry, hostname, pathname));
      } catch {
        return false;
      }
    },
    [domains],
  );

  return { domains, addDomain, removeDomain, isDomainBlocked };
};
