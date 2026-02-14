import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArchiveBookmarkMutation } from "./ArchiveBookmarkMutation";
import { ArchivedBookmarksQuery } from "./ArchivedBookmarksQuery";
import { BookmarksQuery } from "./BookmarksQuery";
import { DeleteBookmarkMutation } from "./DeleteBookmarkMutation";
import { UnarchiveBookmarkMutation } from "./UnarchiveBookmarkMutation";

type ViewMode = "active" | "archived";

export const BookmarkList: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const { data, refetch } = useSuspenseQuery(BookmarksQuery);
  const { data: archivedData, refetch: refetchArchived } = useSuspenseQuery(
    ArchivedBookmarksQuery,
  );
  const [deleteBookmark, { loading: deleting }] = useMutation(
    DeleteBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [archiveBookmark, { loading: archiving }] = useMutation(
    ArchiveBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [unarchiveBookmark, { loading: unarchiving }] = useMutation(
    UnarchiveBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [searchQuery, setSearchQuery] = useState("");

  const currentBookmarks =
    viewMode === "active" ? data?.bookmarks : archivedData?.archivedBookmarks;

  const filteredBookmarks = useMemo(() => {
    if (!currentBookmarks) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentBookmarks;

    return currentBookmarks.filter((bookmark) => {
      const titleMatch = bookmark.title?.toLowerCase().includes(query);
      const descMatch = bookmark.description?.toLowerCase().includes(query);
      const noteMatch = bookmark.note?.toLowerCase().includes(query);
      const tagMatch = bookmark.tags?.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );
      return titleMatch || descMatch || noteMatch || tagMatch;
    });
  }, [currentBookmarks, searchQuery]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Delete "${title}"?`)) {
      deleteBookmark({ variables: { id } });
    }
  };

  const handleArchive = (id: string) => {
    archiveBookmark({ variables: { id } });
  };

  const handleUnarchive = (id: string) => {
    unarchiveBookmark({ variables: { id } });
  };

  const mutating = deleting || archiving || unarchiving;

  const activeCount = data?.bookmarks?.length ?? 0;
  const archivedCount = archivedData?.archivedBookmarks?.length ?? 0;

  if (activeCount === 0 && archivedCount === 0) {
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
        <span className="badge badge-neutral">
          {viewMode === "active" ? activeCount : archivedCount}
        </span>
      </div>
      <div role="tablist" className="tabs tabs-boxed">
        <button
          type="button"
          role="tab"
          className={`tab ${viewMode === "active" ? "tab-active" : ""}`}
          onClick={() => setViewMode("active")}
        >
          Active
        </button>
        <button
          type="button"
          role="tab"
          className={`tab ${viewMode === "archived" ? "tab-active" : ""}`}
          onClick={() => setViewMode("archived")}
        >
          Archived
          {archivedCount > 0 && (
            <span className="badge badge-sm ml-1">{archivedCount}</span>
          )}
        </button>
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
      {filteredBookmarks.length === 0 && !searchQuery.trim() && (
        <p className="text-sm text-base-content/50 text-center py-4">
          {viewMode === "active"
            ? "No active bookmarks"
            : "No archived bookmarks"}
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
              <div className="flex gap-1">
                {viewMode === "active" ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleArchive(bookmark.id)}
                    disabled={mutating}
                  >
                    Archive
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => handleUnarchive(bookmark.id)}
                    disabled={mutating}
                  >
                    Unarchive
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => handleDelete(bookmark.id, bookmark.title)}
                  disabled={mutating}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
