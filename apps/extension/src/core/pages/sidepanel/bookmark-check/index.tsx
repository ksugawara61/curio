import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { Loading } from "../../../components/Loading";
import { BookmarkAddForm } from "./BookmarkAddForm";
import { BookmarkEditForm } from "./BookmarkEditForm";
import { BookmarkQuery } from "./BookmarkQuery";

export type BookmarkCheckProps = {
  currentUrl: string;
  currentTitle: string;
};

const BookmarkCheckContent: FC<BookmarkCheckProps> = ({
  currentUrl,
  currentTitle,
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
      onSuccess={refetch}
    />
  );
};

export const BookmarkCheck: FC<BookmarkCheckProps> = ({
  currentUrl,
  currentTitle,
}) => {
  if (!currentUrl) {
    return <Loading />;
  }

  return (
    <BookmarkCheckContent currentUrl={currentUrl} currentTitle={currentTitle} />
  );
};
