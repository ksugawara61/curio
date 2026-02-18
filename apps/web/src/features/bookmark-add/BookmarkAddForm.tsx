import { useMutation } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";
import { type BookmarkAddFormValues, bookmarkAddFormSchema } from "./schema";

type Props = {
  url: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultThumbnail: string;
  onSuccess: () => void;
};

export const BookmarkAddForm: FC<Props> = ({
  url,
  defaultTitle,
  defaultDescription,
  defaultThumbnail,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookmarkAddFormValues>({
    resolver: zodResolver(bookmarkAddFormSchema),
    defaultValues: {
      title: defaultTitle,
      description: defaultDescription,
      note: "",
      thumbnail: defaultThumbnail,
      tagInput: "",
    },
  });

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        onSuccess();
      },
    },
  );

  const onSubmit = (data: BookmarkAddFormValues) => {
    const tagNames = data.tagInput
      ? data.tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    createBookmark({
      variables: {
        input: {
          title: data.title,
          url,
          description: data.description || undefined,
          note: data.note || undefined,
          thumbnail: data.thumbnail || undefined,
          tagNames: tagNames.length > 0 ? tagNames : undefined,
        },
      },
    });
  };

  return (
    <div className="card bg-base-200">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="card-title text-lg">Add Bookmark</h2>
        <p className="truncate text-sm text-base-content/70">{url}</p>

        <div className="form-control">
          <label className="label" htmlFor="bookmark-title">
            <span className="label-text">Title</span>
          </label>
          <input
            id="bookmark-title"
            type="text"
            className="input input-bordered"
            {...register("title")}
          />
          {errors.title && (
            <span className="label-text-alt mt-1 text-error">
              {errors.title.message}
            </span>
          )}
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
          <label className="label" htmlFor="bookmark-note">
            <span className="label-text">
              Note (optional, Markdown supported)
            </span>
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
            <span className="label-text">Thumbnail URL (optional)</span>
          </label>
          <input
            id="bookmark-thumbnail"
            type="url"
            className="input input-bordered"
            placeholder="https://example.com/image.jpg"
            {...register("thumbnail")}
          />
          {errors.thumbnail && (
            <span className="label-text-alt mt-1 text-error">
              {errors.thumbnail.message}
            </span>
          )}
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
