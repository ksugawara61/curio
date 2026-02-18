import { graphql } from "@curio/graphql-client";

export const FetchUrlMetadataQuery = graphql(`
  query FetchUrlMetadata($url: String!) {
    fetchUrlMetadata(url: $url) {
      title
      description
      thumbnail
    }
  }
`);
