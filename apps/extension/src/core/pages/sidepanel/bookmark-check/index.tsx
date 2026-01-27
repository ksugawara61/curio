import { useQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { BookmarkAddForm } from "./BookmarkAddForm";
import { BookmarkEditForm } from "./BookmarkEditForm";
import { BookmarkQuery } from "./BookmarkQuery";

type Props = {
  currentUrl: string;
  currentTitle: string;
};

export const BookmarkCheck: FC<Props> = ({ currentUrl, currentTitle }) => {
  const { data, loading, error, refetch } = useQuery(BookmarkQuery, {
    variables: { uri: currentUrl },
    skip: !currentUrl,
  });

  const existingBookmark = data?.bookmark;

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
    return <BookmarkEditForm bookmark={existingBookmark} onSuccess={refetch} />;
  }

  return (
    <BookmarkAddForm
      currentUrl={currentUrl}
      currentTitle={currentTitle}
      onSuccess={refetch}
    />
  );
};
