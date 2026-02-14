import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { RssArticlesQuery } from "./RssArticlesQuery";

type Props = {
  feedId: string;
  feedTitle: string;
  onBack: () => void;
};

export const RssFeedDetail: FC<Props> = ({ feedId, feedTitle, onBack }) => {
  const { data } = useSuspenseQuery(RssArticlesQuery, {
    variables: { id: feedId },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
          &larr; Back
        </button>
        <span className="font-semibold text-lg">{feedTitle}</span>
      </div>

      {!data?.rssArticles || data.rssArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="mt-2 text-base-content/70">No articles in this feed</p>
        </div>
      ) : (
        <>
          <span className="badge badge-neutral self-start">
            {data.rssArticles.length} articles
          </span>
          {data.rssArticles.map((article, index) => (
            <div
              key={`${article.link}-${index}`}
              className="card bg-base-200 shadow-sm"
            >
              <div className="card-body p-4">
                {article.thumbnailUrl && (
                  <img
                    src={article.thumbnailUrl}
                    alt={article.title}
                    className="h-32 w-full rounded object-cover"
                  />
                )}
                <h3 className="card-title text-base">
                  <a
                    href={article.link}
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
                {article.pubDate && (
                  <div className="text-xs text-base-content/50">
                    {new Date(article.pubDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
