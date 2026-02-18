import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { z } from "zod";
import { BookmarkAdd } from "../../features/bookmark-add";

const searchSchema = z.object({
  url: z.string().url(),
});

const BookmarkAddPage = () => {
  const { url } = Route.useSearch();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4">
        <Link to="/" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md" />
          </div>
        }
      >
        <BookmarkAdd url={url} />
      </Suspense>
    </div>
  );
};

export const Route = createFileRoute("/bookmarks/add")({
  validateSearch: searchSchema,
  component: BookmarkAddPage,
});
