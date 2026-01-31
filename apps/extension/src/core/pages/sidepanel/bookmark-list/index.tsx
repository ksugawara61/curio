import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BookmarksQuery } from "./BookmarksQuery";
import { DeleteBookmarkMutation } from "./DeleteBookmarkMutation";

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = useMemo(() => {
    if (!data?.bookmarks) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data.bookmarks;

    return data.bookmarks.filter((bookmark) => {
      const titleMatch = bookmark.title?.toLowerCase().includes(query);
      const descMatch = bookmark.description?.toLowerCase().includes(query);
      const noteMatch = bookmark.note?.toLowerCase().includes(query);
      const tagMatch = bookmark.tags?.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );
      return titleMatch || descMatch || noteMatch || tagMatch;
    });
  }, [data?.bookmarks, searchQuery]);

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
      <input
        type="text"
        placeholder="Search by title, description, note, or tag..."
        className="input input-bordered input-sm w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredBookmarks.length === 0 && searchQuery.trim() && (
        <p className="text-sm text-base-content/50 text-center py-4">
          No bookmarks matching &quot;{searchQuery.trim()}&quot;
        </p>
      )}
      {filteredBookmarks.map((bookmark) => (
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
            {bookmark.thumbnail && (
              <img
                src={bookmark.thumbnail}
                alt={bookmark.title}
                className="mt-2 h-32 w-full rounded object-cover"
              />
            )}
            <p className="truncate text-xs text-base-content/50">
              {bookmark.url}
            </p>
            {bookmark.description && (
              <p className="text-sm text-base-content/70 line-clamp-2">
                {bookmark.description}
              </p>
            )}
            {bookmark.note && (
              <div className="prose prose-sm max-w-none text-base-content/70">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {bookmark.note}
                </ReactMarkdown>
              </div>
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
