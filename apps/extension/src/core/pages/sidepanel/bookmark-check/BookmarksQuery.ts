import { graphql } from "@curio/graphql-client";

export const BookmarksQuery = graphql(`
  query Bookmarks {
    bookmarks {
      __typename
      id
      title
      url
      description
      created_at
      updated_at
      tags {
        id
        name
      }
    }
  }
`);
