import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

export const RecentArticleList: FC = () => {
  const { data } = useSuspenseQuery(RecentArticlesQuery);
  const articles = data?.recentArticles ?? [];

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl">
          <span role="img" aria-label="newspaper">
            &#128240;
          </span>
        </div>
        <p className="mt-2 text-base-content/70">No recent articles</p>
        <p className="text-sm text-base-content/50">
          Add RSS feeds in the extension to see articles here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">Recent Articles</span>
        <span className="badge badge-neutral">{articles.length}</span>
      </div>
      {articles.map((article) => (
        <div key={article.id} className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-base">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {article.title}
              </a>
            </h3>
            {article.thumbnail_url && (
              <img
                src={article.thumbnail_url}
                alt={article.title}
                className="mt-2 h-32 w-full rounded object-cover"
              />
            )}
            <p className="truncate text-xs text-base-content/50">
              {article.url}
            </p>
            {article.description && (
              <p className="text-sm text-base-content/70 line-clamp-2">
                {article.description}
              </p>
            )}
            <div className="text-xs text-base-content/50">
              {article.pub_date
                ? new Date(article.pub_date).toLocaleDateString()
                : new Date(article.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
