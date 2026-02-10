import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useForm } from "react-hook-form";
import { ErrorFallback } from "../../../shared/components/ErrorFallback";
import { Loading } from "../../../shared/components/Loading";
import { CreateRssFeedMutation } from "./CreateRssFeedMutation";
import { DeleteRssFeedMutation } from "./DeleteRssFeedMutation";
import { RssFeedDetail } from "./RssFeedDetail";
import { RssFeedsQuery } from "./RssFeedsQuery";
import { type RssFeedFormValues, rssFeedFormSchema } from "./schema";

type SelectedFeed = {
  id: string;
  title: string;
};

export const RssFeedList: FC = () => {
  const { data, refetch } = useSuspenseQuery(RssFeedsQuery);
  const [selectedFeed, setSelectedFeed] = useState<SelectedFeed | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RssFeedFormValues>({
    resolver: zodResolver(rssFeedFormSchema),
    defaultValues: { url: "" },
  });

  const [createRssFeed, { loading: creating, error: createError }] =
    useMutation(CreateRssFeedMutation, {
      onCompleted: () => {
        refetch();
        reset();
      },
    });

  const [deleteRssFeed, { loading: deleting }] = useMutation(
    DeleteRssFeedMutation,
    {
      onCompleted: () => {
        refetch();
      },
    },
  );

  const onSubmit = (values: RssFeedFormValues) => {
    createRssFeed({ variables: { url: values.url } });
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteRssFeed({ variables: { id } });
    }
  };

  if (selectedFeed) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <RssFeedDetail
            feedId={selectedFeed.id}
            feedTitle={selectedFeed.title}
            onBack={() => setSelectedFeed(null)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">RSS Feeds</span>
        {data?.rssFeeds && data.rssFeeds.length > 0 && (
          <span className="badge badge-neutral">{data.rssFeeds.length}</span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card bg-base-200 p-4">
        <div className="form-control">
          <label className="label" htmlFor="rss-feed-url">
            <span className="label-text">Add RSS Feed</span>
          </label>
          <div className="flex gap-2">
            <input
              id="rss-feed-url"
              type="url"
              className={`input input-bordered input-sm flex-1 ${errors.url ? "input-error" : ""}`}
              placeholder="https://example.com/rss.xml"
              {...register("url")}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={creating}
            >
              {creating ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Add"
              )}
            </button>
          </div>
          {errors.url && (
            <p className="label label-text-alt text-error">
              {errors.url.message}
            </p>
          )}
          {createError && (
            <p className="label label-text-alt text-error">
              {createError.message}
            </p>
          )}
        </div>
      </form>

      {!data?.rssFeeds || data.rssFeeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-4xl">
            <span role="img" aria-label="rss">
              &#128225;
            </span>
          </div>
          <p className="mt-2 text-base-content/70">No RSS feeds yet</p>
          <p className="text-sm text-base-content/50">
            Add an RSS feed URL above to get started
          </p>
        </div>
      ) : (
        data.rssFeeds.map((feed) => (
          <div key={feed.id} className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-base">
                <button
                  type="button"
                  className="link link-primary text-left"
                  onClick={() =>
                    setSelectedFeed({ id: feed.id, title: feed.title })
                  }
                >
                  {feed.title}
                </button>
              </h3>
              <p className="truncate text-xs text-base-content/50">
                {feed.url}
              </p>
              {feed.description && (
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {feed.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="text-xs text-base-content/50">
                  {new Date(feed.created_at).toLocaleDateString()}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => handleDelete(feed.id, feed.title)}
                  disabled={deleting}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
