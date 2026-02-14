import { type FC, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../shared/components/ErrorFallback";
import { Loading } from "../../shared/components/Loading";
import { SignOutButton } from "../../shared/components/sign-out-button";
import { useCurrentTab } from "../../shared/hooks/useCurrentTab";
import { ArticleList } from "./article-list";
import { BookmarkCheck } from "./bookmark-check";
import { BookmarkList } from "./bookmark-list";
import { RssFeedList } from "./rss-feed-list";
import { Settings } from "./settings";

type TabType = "current" | "bookmarks" | "articles" | "feeds" | "settings";

type Props = {
  initialUrl?: string;
  initialTitle?: string;
};

export const SidePanel: FC<Props> = ({ initialUrl, initialTitle }) => {
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const { currentUrl, currentTitle, currentThumbnail } = useCurrentTab({
    initialUrl,
    initialTitle,
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: "current", label: "Current Page" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "articles", label: "Articles" },
    { id: "feeds", label: "Feeds" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="sticky top-0 z-10 bg-base-100 shadow-sm">
        <div className="p-4 pb-0">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="font-bold text-xl">Curio</h1>
            <SignOutButton />
          </div>
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
                currentThumbnail={currentThumbnail}
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
        {activeTab === "feeds" && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <RssFeedList />
            </Suspense>
          </ErrorBoundary>
        )}
        {activeTab === "settings" && (
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};
