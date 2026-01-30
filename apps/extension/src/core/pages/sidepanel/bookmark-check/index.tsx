import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { Loading } from "../../../shared/components/Loading";
import { BookmarkQuery } from "../../shared/graphql/BookmarkQuery";
import { BookmarkAddForm } from "./BookmarkAddForm";
import { BookmarkEditForm } from "./BookmarkEditForm";

type BookmarkCheckProps = {
  currentUrl: string;
  currentTitle: string;
  currentThumbnail?: string;
};

const BookmarkCheckContent: FC<BookmarkCheckProps> = ({
  currentUrl,
  currentTitle,
  currentThumbnail,
}) => {
  const { data, refetch } = useSuspenseQuery(BookmarkQuery, {
    variables: { uri: currentUrl },
  });

  const existingBookmark = data?.bookmark;

  if (existingBookmark) {
    return <BookmarkEditForm bookmark={existingBookmark} onSuccess={refetch} />;
  }

  return (
    <BookmarkAddForm
      currentUrl={currentUrl}
      currentTitle={currentTitle}
      currentThumbnail={currentThumbnail}
      onSuccess={refetch}
    />
  );
};

export const BookmarkCheck: FC<BookmarkCheckProps> = ({
  currentUrl,
  currentTitle,
  currentThumbnail,
}) => {
  if (!currentUrl) {
    return <Loading />;
  }

  return (
    <BookmarkCheckContent
      currentUrl={currentUrl}
      currentTitle={currentTitle}
      currentThumbnail={currentThumbnail}
    />
  );
};
