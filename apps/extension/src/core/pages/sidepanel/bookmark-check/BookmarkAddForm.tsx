import { useMutation } from "@curio/graphql-client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { CreateBookmarkMutation } from "../../../shared/graphql/mutations/CreateBookmarkMutation";
import { type BookmarkFormValues, bookmarkFormSchema } from "./schema";

type Props = {
  currentUrl: string;
  currentTitle: string;
  onSuccess: () => void;
};

export const BookmarkAddForm: FC<Props> = ({
  currentUrl,
  currentTitle,
  onSuccess,
}) => {
  const { register, handleSubmit, reset } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: {
      description: "",
      tagInput: "",
    },
  });

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        onSuccess();
        reset();
      },
    },
  );

  const onSubmit = (data: BookmarkFormValues) => {
    const tagNames = data.tagInput
      ? data.tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

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
  };

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
