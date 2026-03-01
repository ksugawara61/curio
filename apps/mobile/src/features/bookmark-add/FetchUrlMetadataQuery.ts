import { graphql } from "@curio/graphql-client";

export const FetchUrlMetadataQuery = graphql(`
  query BookmarkAddFetchUrlMetadata($url: String!) {
    fetchUrlMetadata(url: $url) {
      title
      description
      thumbnail
    }
  }
`);
