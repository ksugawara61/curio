import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

export const RecentArticles: FC = () => {
  const { data } = useSuspenseQuery(RecentArticlesQuery);

  if (!data?.articles || data.articles.length === 0) {
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
      <div className="flex items-center justify-between">
        <span className="badge badge-neutral">
          {data.articles.length} articles
        </span>
      </div>
      {data.articles.map((article, index) => (
        <div
          key={article.id ?? `${article.url}-${index}`}
          className="card bg-base-200 shadow-sm"
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
                className="link link-primary"
              >
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
                {new Date(article.pub_date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
