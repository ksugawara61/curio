import { useMutation } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArchiveBookmarkMutation } from "./ArchiveBookmarkMutation";
import { type BookmarkFormValues, bookmarkFormSchema } from "./schema";
import { UnarchiveBookmarkMutation } from "./UnarchiveBookmarkMutation";
import { UpdateBookmarkMutation } from "./UpdateBookmarkMutation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  note: string | null;
  thumbnail: string | null;
  archived_at: string | null;
  created_at: string;
  tags: Array<{ id: string; name: string }> | null;
};

type Props = {
  bookmark: Bookmark;
  onSuccess: () => void;
};

export const BookmarkEditForm: FC<Props> = ({ bookmark, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: {
      description: "",
      note: "",
      thumbnail: "",
      tagInput: "",
    },
  });

  const [updateBookmark, { loading: updating }] = useMutation(
    UpdateBookmarkMutation,
    {
      onCompleted: () => {
        onSuccess();
      },
    },
  );

  const [archiveBookmark, { loading: archivingBookmark }] = useMutation(
    ArchiveBookmarkMutation,
    {
      onCompleted: () => {
        onSuccess();
      },
    },
  );

  const [unarchiveBookmark, { loading: unarchivingBookmark }] = useMutation(
    UnarchiveBookmarkMutation,
    {
      onCompleted: () => {
        onSuccess();
      },
    },
  );

  useEffect(() => {
    reset({
      description: bookmark.description ?? "",
      note: bookmark.note ?? "",
      thumbnail: bookmark.thumbnail ?? "",
      tagInput: bookmark.tags?.map((tag) => tag.name).join(", ") ?? "",
    });
  }, [bookmark, reset]);

  const onSubmit = (data: BookmarkFormValues) => {
    const tagNames = data.tagInput
      ? data.tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    updateBookmark({
      variables: {
        id: bookmark.id,
        input: {
          description: data.description || undefined,
          note: data.note || undefined,
          thumbnail: data.thumbnail || undefined,
          tagNames: tagNames.length > 0 ? tagNames : undefined,
        },
      },
    });
  };

  const isArchived = bookmark.archived_at !== null;
  const mutating = updating || archivingBookmark || unarchivingBookmark;

  return (
    <div className="card bg-base-200">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-success">Bookmarked</span>
          {isArchived && <span className="badge badge-warning">Archived</span>}
        </div>
        <h2 className="card-title text-lg">{bookmark.title}</h2>
        <a
          href={bookmark.url}
          className="link link-primary truncate text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          {bookmark.url}
        </a>

        <div className="form-control mt-4">
          <label className="label" htmlFor="bookmark-description">
            <span className="label-text">Description</span>
          </label>
          <textarea
            id="bookmark-description"
            className="textarea textarea-bordered"
            placeholder="Add a description..."
            {...register("description")}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-note">
            <span className="label-text">Note (Markdown supported)</span>
          </label>
          <textarea
            id="bookmark-note"
            className="textarea textarea-bordered"
            rows={6}
            placeholder="Add notes in Markdown format..."
            {...register("note")}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-thumbnail">
            <span className="label-text">Thumbnail URL</span>
          </label>
          <input
            id="bookmark-thumbnail"
            type="url"
            className="input input-bordered"
            placeholder="https://example.com/image.jpg"
            {...register("thumbnail")}
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-tags">
            <span className="label-text">Tags (comma separated)</span>
          </label>
          <input
            id="bookmark-tags"
            type="text"
            className="input input-bordered"
            placeholder="e.g., tech, tutorial, react"
            {...register("tagInput")}
          />
        </div>

        <div className="mt-2 text-xs text-base-content/50">
          Added: {new Date(bookmark.created_at).toLocaleDateString()}
        </div>

        <div className="card-actions mt-4 justify-end">
          {isArchived ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={mutating}
              onClick={() =>
                unarchiveBookmark({ variables: { id: bookmark.id } })
              }
            >
              {unarchivingBookmark ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Unarchiving...
                </>
              ) : (
                "Unarchive"
              )}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={mutating}
              onClick={() =>
                archiveBookmark({ variables: { id: bookmark.id } })
              }
            >
              {archivingBookmark ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Archiving...
                </>
              ) : (
                "Archive"
              )}
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={mutating}>
            {updating ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Updating...
              </>
            ) : (
              "Update Bookmark"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
