import { graphql } from "@curio/graphql-client";

export const BookmarkQuery = graphql(`
  query Bookmark($uri: String!) {
    bookmark(uri: $uri) {
      __typename
      archived_at
      created_at
      description
      id
      note
      relatedBookmarks {
        id
        title
        url
      }
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
