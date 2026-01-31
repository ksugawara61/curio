import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "blockedDomains";

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

export const useBlockedDomains = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlockedDomains().then((d) => {
      setDomains(d);
      setLoading(false);
    });
  }, []);

  const addDomain = useCallback(
    async (domain: string) => {
      const trimmed = domain.trim().toLowerCase();
      if (!trimmed || domains.includes(trimmed)) return;
      const updated = [...domains, trimmed];
      await setBlockedDomains(updated);
      setDomains(updated);
    },
    [domains],
  );

  const removeDomain = useCallback(
    async (domain: string) => {
      const updated = domains.filter((d) => d !== domain);
      await setBlockedDomains(updated);
      setDomains(updated);
    },
    [domains],
  );

  const isDomainBlocked = useCallback(
    (url: string): boolean => {
      const hostname = extractDomain(url);
      if (!hostname) return false;
      return domains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
    },
    [domains],
  );

  return { domains, loading, addDomain, removeDomain, isDomainBlocked };
};
