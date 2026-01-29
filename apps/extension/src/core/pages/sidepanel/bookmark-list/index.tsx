import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { DeleteBookmarkMutation } from "../../../shared/graphql/mutations/DeleteBookmarkMutation";
import { BookmarksQuery } from "../../../shared/graphql/queries/BookmarksQuery";

export const BookmarkList: FC = () => {
  const { data, refetch } = useSuspenseQuery(BookmarksQuery);
  const [deleteBookmark, { loading: deleting }] = useMutation(
    DeleteBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
      },
    },
  );

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteBookmark({ variables: { id } });
    }
  };

  if (!data?.bookmarks || data.bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-4xl">
          <span role="img" aria-label="bookmark">
            &#128278;
          </span>
        </div>
        <p className="mt-2 text-base-content/70">No bookmarks yet</p>
        <p className="text-sm text-base-content/50">
          Add bookmarks from the Current Page tab
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">Bookmarks</span>
        <span className="badge badge-neutral">{data.bookmarks.length}</span>
      </div>
      {data.bookmarks.map((bookmark) => (
        <div key={bookmark.id} className="card bg-base-200 shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-base">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {bookmark.title}
              </a>
            </h3>
            <p className="truncate text-xs text-base-content/50">
              {bookmark.url}
            </p>
            {bookmark.description && (
              <p className="text-sm text-base-content/70 line-clamp-2">
                {bookmark.description}
              </p>
            )}
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.map((tag) => (
                  <span key={tag.id} className="badge badge-outline badge-sm">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs text-base-content/50">
                {new Date(bookmark.created_at).toLocaleDateString()}
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => handleDelete(bookmark.id, bookmark.title)}
                disabled={deleting}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
