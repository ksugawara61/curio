import useSWRSubscription, {
  type SWRSubscriptionOptions,
} from "swr/subscription";

type TabInfo = {
  url: string;
  title: string;
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
        next(null, { url: initialUrl, title: initialTitle });
        return () => {};
      }

      if (typeof chrome === "undefined" || !chrome.tabs) {
        return () => {};
      }

      const getCurrentTab = async () => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.url && tab?.title) {
          next(null, { url: tab.url, title: tab.title });
        }
      };

      getCurrentTab();

      const onActivatedListener = () => {
        getCurrentTab();
      };
      chrome.tabs.onActivated.addListener(onActivatedListener);

      const onUpdatedListener: Parameters<
        typeof chrome.tabs.onUpdated.addListener
      >[0] = (_tabId, changeInfo, tab) => {
        if (changeInfo.status === "complete" && tab.active) {
          if (tab.url && tab.title) {
            next(null, { url: tab.url, title: tab.title });
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
  };
};
