import useSWRSubscription, {
  type SWRSubscriptionOptions,
} from "swr/subscription";

type TabInfo = {
  url: string;
  title: string;
  thumbnail: string;
};

type UseCurrentTabOptions = {
  initialUrl?: string;
  initialTitle?: string;
};

export const useCurrentTab = (options: UseCurrentTabOptions = {}) => {
  const { initialUrl, initialTitle } = options;

  const { data } = useSWRSubscription(
    "currentTab",
    (
      _key: string,
      { next }: SWRSubscriptionOptions<TabInfo | undefined, Error>,
    ) => {
      if (initialUrl && initialTitle) {
        next(null, { url: initialUrl, title: initialTitle, thumbnail: "" });
        return () => {};
      }

      if (typeof chrome === "undefined" || !chrome.tabs) {
        return () => {};
      }

      const fetchThumbnail = async (tabId: number): Promise<string> => {
        try {
          const results = await chrome.scripting.executeScript({
            target: { tabId },
            func: () => {
              const ogImage = document.querySelector<HTMLMetaElement>(
                'meta[property="og:image"]',
              );
              if (ogImage?.content) return ogImage.content;

              const twitterImage = document.querySelector<HTMLMetaElement>(
                'meta[name="twitter:image"]',
              );
              if (twitterImage?.content) return twitterImage.content;

              const linkIcon = document.querySelector<HTMLLinkElement>(
                'link[rel="apple-touch-icon"]',
              );
              if (linkIcon?.href) return linkIcon.href;

              return "";
            },
          });
          return results?.[0]?.result ?? "";
        } catch {
          return "";
        }
      };

      const getCurrentTab = async () => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.url && tab?.title && tab?.id != null) {
          const thumbnail = await fetchThumbnail(tab.id);
          next(null, { url: tab.url, title: tab.title, thumbnail });
        }
      };

      getCurrentTab();

      const onActivatedListener = () => {
        getCurrentTab();
      };
      chrome.tabs.onActivated.addListener(onActivatedListener);

      const onUpdatedListener: Parameters<
        typeof chrome.tabs.onUpdated.addListener
      >[0] = async (_tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.active) {
          if (tab.url && tab.title && tab.id != null) {
            const thumbnail = await fetchThumbnail(tab.id);
            next(null, { url: tab.url, title: tab.title, thumbnail });
          }
        }
      };
      chrome.tabs.onUpdated.addListener(onUpdatedListener);

      return () => {
        chrome.tabs.onActivated.removeListener(onActivatedListener);
        chrome.tabs.onUpdated.removeListener(onUpdatedListener);
      };
    },
  );

  return {
    currentUrl: data?.url ?? "",
    currentTitle: data?.title ?? "",
    currentThumbnail: data?.thumbnail ?? "",
  };
};
