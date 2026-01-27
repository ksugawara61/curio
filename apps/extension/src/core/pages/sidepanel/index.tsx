import { type FC, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../components/ErrorFallback";
import { Loading } from "../../components/Loading";
import { ArticleList } from "./article-list";
import { BookmarkCheck } from "./bookmark-check";
import { BookmarkList } from "./bookmark-list";

type TabType = "current" | "bookmarks" | "articles";

type Props = {
  initialUrl?: string;
  initialTitle?: string;
};

export const SidePanel: FC<Props> = ({ initialUrl, initialTitle }) => {
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [currentUrl, setCurrentUrl] = useState(initialUrl ?? "");
  const [currentTitle, setCurrentTitle] = useState(initialTitle ?? "");

  useEffect(() => {
    if (initialUrl && initialTitle) {
      return;
    }

    if (typeof chrome === "undefined" || !chrome.tabs) {
      return;
    }

    const getCurrentTab = async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab?.url && tab?.title) {
        setCurrentUrl(tab.url);
        setCurrentTitle(tab.title);
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
          setCurrentUrl(tab.url);
          setCurrentTitle(tab.title);
        }
      }
    };
    chrome.tabs.onUpdated.addListener(onUpdatedListener);

    return () => {
      chrome.tabs.onActivated.removeListener(onActivatedListener);
      chrome.tabs.onUpdated.removeListener(onUpdatedListener);
    };
  }, [initialUrl, initialTitle]);

  const tabs: { id: TabType; label: string }[] = [
    { id: "current", label: "Current Page" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "articles", label: "Articles" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="p-4 pb-0">
          <h1 className="mb-3 font-bold text-xl">Curio</h1>
          <div role="tablist" className="tabs tabs-bordered">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "current" && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <BookmarkCheck
                currentUrl={currentUrl}
                currentTitle={currentTitle}
              />
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === "bookmarks" && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <BookmarkList />
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === "articles" && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <ArticleList />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
