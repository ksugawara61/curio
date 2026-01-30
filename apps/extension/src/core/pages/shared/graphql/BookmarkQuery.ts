import { graphql } from "@curio/graphql-client";

export const BookmarkQuery = graphql(`
  query Bookmark($uri: String!) {
    bookmark(uri: $uri) {
      __typename
      created_at
      description
      id
      tags {
        id
        name
      }
      thumbnail
      title
      updated_at
      url
    }
  }
`);
