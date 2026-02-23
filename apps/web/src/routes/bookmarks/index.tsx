import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { BookmarkList } from "../../features/bookmark-list";

const Bookmarks = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md" />
          </div>
        }
      >
        <BookmarkList />
      </Suspense>
    </div>
  );
};

export const Route = createFileRoute("/bookmarks/")({
  component: Bookmarks,
});
