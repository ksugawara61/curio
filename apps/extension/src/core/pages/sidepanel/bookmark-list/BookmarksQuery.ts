import { graphql } from "@curio/graphql-client";

export const BookmarksQuery = graphql(`
  query BookmarksList {
    bookmarks {
      __typename
      created_at
      description
      id
      tags {
        id
        name
      }
      title
      updated_at
      url
    }
  }
`);
