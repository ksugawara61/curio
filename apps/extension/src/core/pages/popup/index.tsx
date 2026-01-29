import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../shared/components/ErrorFallback";
import { Loading } from "../../shared/components/Loading";
import { useCurrentTab } from "../../shared/hooks/useCurrentTab";
import { BookmarkQuery } from "../sidepanel/bookmark-check/BookmarkQuery";
import { CreateBookmarkMutation } from "../sidepanel/bookmark-check/CreateBookmarkMutation";

type BookmarkContentProps = {
  currentUrl: string;
  currentTitle: string;
};

const BookmarkContent: FC<BookmarkContentProps> = ({
  currentUrl,
  currentTitle,
}) => {
  const { data, refetch } = useSuspenseQuery(BookmarkQuery, {
    variables: { uri: currentUrl },
  });

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
      },
    },
  );

  const existingBookmark = data?.bookmark;

  const handleCreateBookmark = () => {
    createBookmark({
      variables: {
        input: {
          title: currentTitle,
          url: currentUrl,
        },
      },
    });
  };

  if (existingBookmark) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="badge badge-success">Bookmarked</span>
        </div>
        <h2 className="font-semibold text-sm">{existingBookmark.title}</h2>
        <p className="truncate text-xs text-base-content/70">
          {existingBookmark.url}
        </p>
        {existingBookmark.tags && existingBookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {existingBookmark.tags.map((tag) => (
              <span key={tag.id} className="badge badge-outline badge-xs">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-base-content/50">
          Added: {new Date(existingBookmark.created_at).toLocaleDateString()}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-semibold text-sm">{currentTitle}</h2>
      <p className="truncate text-xs text-base-content/70">{currentUrl}</p>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={handleCreateBookmark}
        disabled={creating}
      >
        {creating ? (
          <>
            <span className="loading loading-spinner loading-xs" />
            Adding...
          </>
        ) : (
          "Bookmark this page"
        )}
      </button>
    </div>
  );
};

type PopupProps = {
  initialUrl?: string;
  initialTitle?: string;
};

export const Popup: FC<PopupProps> = ({ initialUrl, initialTitle }) => {
  const { currentUrl, currentTitle } = useCurrentTab({
    initialUrl,
    initialTitle,
  });

  return (
    <div className="w-80 bg-base-100 p-4">
      <h1 className="mb-3 font-bold text-lg">Curio</h1>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          {currentUrl ? (
            <BookmarkContent
              currentUrl={currentUrl}
              currentTitle={currentTitle}
            />
          ) : (
            <Loading />
          )}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
