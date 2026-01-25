import { useQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { ArticlesQuery } from "./ArticlesQuery";

export const ArticleList: FC = () => {
  const { data, loading, error } = useQuery(ArticlesQuery, {
    variables: {
      limit: 20,
      offset: 0,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <span className="loading loading-spinner loading-lg" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error.message}</span>
      </div>
    );
  }

  if (!data?.articles || data.articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl">
          <span role="img" aria-label="article">
            &#128196;
          </span>
        </div>
        <p className="mt-2 text-base-content/70">No articles yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">Articles</span>
        <span className="badge badge-neutral">{data.articles.length}</span>
      </div>
      {data.articles.map((article) => (
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
            {article.user?.name && (
              <p className="text-xs text-base-content/50">
                by {article.user.name}
              </p>
            )}
            <p className="text-sm text-base-content/70 line-clamp-2">
              {article.body}
            </p>
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {article.tags.map((tag, index) => (
                  <span
                    key={`${article.id}-${tag.name}-${index}`}
                    className="badge badge-outline badge-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="text-xs text-base-content/50">
              {new Date(article.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
