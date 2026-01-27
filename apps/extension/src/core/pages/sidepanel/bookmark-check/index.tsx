import { useMutation, useQuery } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BookmarkQuery } from "./BookmarkQuery";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";
import { type BookmarkFormValues, bookmarkFormSchema } from "./schema";
import { UpdateBookmarkMutation } from "./UpdateBookmarkMutation";

type Props = {
  currentUrl: string;
  currentTitle: string;
};

export const BookmarkCheck: FC<Props> = ({ currentUrl, currentTitle }) => {
  const { register, handleSubmit, reset } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: {
      description: "",
      tagInput: "",
    },
  });

  const { data, loading, error, refetch } = useQuery(BookmarkQuery, {
    variables: { uri: currentUrl },
    skip: !currentUrl,
  });

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        reset();
      },
    },
  );

  const [updateBookmark, { loading: updating }] = useMutation(
    UpdateBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
      },
    },
  );

  const existingBookmark = data?.bookmark;

  // Reset form with existing bookmark data when bookmark is loaded
  useEffect(() => {
    if (existingBookmark) {
      reset({
        description: existingBookmark.description ?? "",
        tagInput:
          existingBookmark.tags?.map((tag) => tag.name).join(", ") ?? "",
      });
    }
  }, [existingBookmark, reset]);

  const onSubmit = (data: BookmarkFormValues) => {
    const tagNames = data.tagInput
      ? data.tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    if (existingBookmark) {
      updateBookmark({
        variables: {
          id: existingBookmark.id,
          input: {
            description: data.description || undefined,
            tagNames: tagNames.length > 0 ? tagNames : undefined,
          },
        },
      });
    } else {
      createBookmark({
        variables: {
          input: {
            title: currentTitle,
            url: currentUrl,
            description: data.description || undefined,
            tagNames: tagNames.length > 0 ? tagNames : undefined,
          },
        },
      });
    }
  };

  if (!currentUrl || loading) {
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

  if (existingBookmark) {
    return (
      <div className="card bg-base-200">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2 flex items-center gap-2">
            <span className="badge badge-success">Bookmarked</span>
          </div>
          <h2 className="card-title text-lg">{existingBookmark.title}</h2>
          <a
            href={existingBookmark.url}
            className="link link-primary truncate text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {existingBookmark.url}
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
            Added: {new Date(existingBookmark.created_at).toLocaleDateString()}
          </div>

          <div className="card-actions mt-4 justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updating}
            >
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
  }

  return (
    <div className="card bg-base-200">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="card-title text-lg">Add Bookmark</h2>
        <p className="truncate text-sm text-base-content/70">{currentUrl}</p>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-title">
            <span className="label-text">Title</span>
          </label>
          <input
            id="bookmark-title"
            type="text"
            className="input input-bordered"
            value={currentTitle}
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-description">
            <span className="label-text">Description (optional)</span>
          </label>
          <textarea
            id="bookmark-description"
            className="textarea textarea-bordered"
            placeholder="Add a description..."
            {...register("description")}
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

        <div className="card-actions mt-4 justify-end">
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Adding...
              </>
            ) : (
              "Add Bookmark"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
