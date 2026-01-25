import { useQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { ArticlesQuery } from "./ArticlesQuery";

export const SidePanel: FC = () => {
  const { data, loading, error } = useQuery(ArticlesQuery, {
    variables: {
      limit: 20,
      offset: 0,
    },
  });

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="rounded-lg bg-base-100 p-6 shadow-xl">
        <div className="mb-4 font-bold text-2xl">Curio Articles</div>

        {loading && (
          <output className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg" />
            <span className="sr-only">Loading...</span>
          </output>
        )}

        {error && (
          <div className="alert alert-error">
            <span>Error: {error.message}</span>
          </div>
        )}

        {data?.articles && (
          <div className="flex flex-col gap-4">
            {data.articles.map((article) => (
              <div key={article.id} className="card bg-base-200 shadow-md">
                <div className="card-body">
                  <h2 className="card-title">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      {article.title}
                    </a>
                  </h2>
                  <div className="text-sm text-base-content/70">
                    {article.user?.name && <span>by {article.user.name}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={`${article.id}-${tag.name}-${index}`}
                        className="badge badge-outline"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm line-clamp-3">{article.body}</p>
                  <div className="text-xs text-base-content/50">
                    {new Date(article.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
