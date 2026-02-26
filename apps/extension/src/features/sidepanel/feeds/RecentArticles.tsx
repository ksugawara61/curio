import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, useState } from "react";
import { MarkArticleAsReadMutation } from "./MarkArticleAsReadMutation";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

type FilterTab = "unread" | "all";

export const RecentArticles: FC = () => {
  const { data } = useSuspenseQuery(RecentArticlesQuery);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("unread");
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());

  const [markAsRead] = useMutation(MarkArticleAsReadMutation);

  const articles = data?.articles ?? [];

  const isRead = (article: (typeof articles)[number]): boolean => {
    if (!article.id) return false;
    return !!article.read_at || localReadIds.has(article.id);
  };

  const handleLinkClick = (articleId: string | null | undefined) => {
    if (!articleId) return;
    if (localReadIds.has(articleId)) return;
    setLocalReadIds((prev) => new Set(prev).add(articleId));
    markAsRead({ variables: { id: articleId } });
  };

  const filteredArticles =
    activeFilter === "unread" ? articles.filter((a) => !isRead(a)) : articles;

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "unread", label: "未読" },
    { id: "all", label: "すべて" },
  ];

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl">
          <span role="img" aria-label="newspaper">
            &#128240;
          </span>
        </div>
        <p className="mt-2 text-base-content/70">No recent articles</p>
        <p className="text-sm text-base-content/50">
          Add RSS feeds to see recent articles here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="tabs tabs-bordered tabs-sm">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`tab ${activeFilter === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveFilter(tab.id)}
            aria-selected={activeFilter === tab.id}
          >
            {tab.label}
            {tab.id === "unread" && (
              <span className="badge badge-sm badge-neutral ml-1">
                {articles.filter((a) => !isRead(a)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl">
            <span role="img" aria-label="check">
              ✅
            </span>
          </div>
          <p className="mt-2 text-base-content/70">未読記事はありません</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="badge badge-neutral">
              {filteredArticles.length} articles
            </span>
          </div>
          {filteredArticles.map((article, index) => {
            const read = isRead(article);
            return (
              <div
                key={article.id ?? `${article.url}-${index}`}
                className={`card shadow-sm ${read ? "bg-base-300 opacity-70" : "bg-base-200"}`}
              >
                <div className="card-body p-4">
                  {article.thumbnail_url && (
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="h-32 w-full rounded object-cover"
                    />
                  )}
                  <h3 className="card-title text-base">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary flex items-center gap-1"
                      onClick={() => handleLinkClick(article.id)}
                    >
                      {activeFilter === "all" && (
                        <span
                          role="img"
                          className={`text-base ${read ? "text-success" : "text-base-content/40"}`}
                          aria-label={read ? "既読" : "未読"}
                          title={read ? "既読" : "未読"}
                        >
                          {read ? "●" : "○"}
                        </span>
                      )}
                      {article.title}
                    </a>
                  </h3>
                  {article.description && (
                    <p className="text-sm text-base-content/70 line-clamp-3">
                      {article.description}
                    </p>
                  )}
                  {article.pub_date && (
                    <div className="text-xs text-base-content/50">
                      {new Date(article.pub_date).toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
