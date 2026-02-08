import { useSuspenseQuery } from "@curio/graphql-client";
import type { FC } from "react";
import { Loading } from "../../../core/shared/components/Loading";
import { useBlockedDomains } from "../../../core/shared/hooks/useBlockedDomains";
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
  const { isDomainBlocked } = useBlockedDomains();

  const existingBookmark = data?.bookmark;

  if (isDomainBlocked(currentUrl)) {
    return (
      <p className="text-sm text-base-content/70">
        Bookmarking is disabled for this domain.
      </p>
    );
  }

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
