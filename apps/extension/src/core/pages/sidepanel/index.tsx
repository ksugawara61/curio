import { type FC, useEffect, useState } from "react";
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

    const getCurrentTab = async () => {
      if (typeof chrome !== "undefined" && chrome.tabs) {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.url && tab?.title) {
          setCurrentUrl(tab.url);
          setCurrentTitle(tab.title);
        }
      }
    };

    getCurrentTab();

    if (typeof chrome !== "undefined" && chrome.tabs?.onActivated) {
      const listener = () => {
        getCurrentTab();
      };
      chrome.tabs.onActivated.addListener(listener);
      return () => {
        chrome.tabs.onActivated.removeListener(listener);
      };
    }
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
          <BookmarkCheck currentUrl={currentUrl} currentTitle={currentTitle} />
        )}
        {activeTab === "bookmarks" && <BookmarkList />}
        {activeTab === "articles" && <ArticleList />}
      </div>
    </div>
  );
};
