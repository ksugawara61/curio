import { useMutation } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { type BookmarkFormValues, bookmarkFormSchema } from "./schema";
import { UpdateBookmarkMutation } from "./UpdateBookmarkMutation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
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

  useEffect(() => {
    reset({
      description: bookmark.description ?? "",
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
          thumbnail: data.thumbnail || undefined,
          tagNames: tagNames.length > 0 ? tagNames : undefined,
        },
      },
    });
  };

  return (
    <div className="card bg-base-200">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 flex items-center gap-2">
          <span className="badge badge-success">Bookmarked</span>
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
          <button type="submit" className="btn btn-primary" disabled={updating}>
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
