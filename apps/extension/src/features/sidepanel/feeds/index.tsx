import { type FC, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../../shared/components/ErrorFallback";
import { Loading } from "../../../shared/components/Loading";
import { RssFeedList } from "../rss-feed-list";
import { RecentArticles } from "./RecentArticles";

type FeedsSubTab = "recent" | "feeds";

export const FeedsTab: FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<FeedsSubTab>("recent");

  const subTabs: { id: FeedsSubTab; label: string }[] = [
    { id: "recent", label: "Recent Articles" },
    { id: "feeds", label: "RSS Feeds" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="tabs tabs-bordered">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`tab ${activeSubTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveSubTab(tab.id)}
            aria-selected={activeSubTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "recent" && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>
            <RecentArticles />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeSubTab === "feeds" && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>
            <RssFeedList />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
};
