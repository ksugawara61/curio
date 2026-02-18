import { useSuspenseQuery } from "@curio/graphql-client";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { BookmarkAddForm } from "./BookmarkAddForm";
import { FetchUrlMetadataQuery } from "./FetchUrlMetadataQuery";

type Props = {
  url: string;
};

export const BookmarkAdd: FC<Props> = ({ url }) => {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(FetchUrlMetadataQuery, {
    variables: { url },
  });

  const metadata = data.fetchUrlMetadata;

  const handleSuccess = () => {
    navigate({ to: "/" });
  };

  return (
    <BookmarkAddForm
      url={url}
      defaultTitle={metadata.title ?? ""}
      defaultDescription={metadata.description ?? ""}
      defaultThumbnail={metadata.thumbnail ?? ""}
      onSuccess={handleSuccess}
    />
  );
};
