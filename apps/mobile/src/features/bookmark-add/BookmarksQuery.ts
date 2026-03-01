import { graphql } from "@curio/graphql-client";

export const BookmarksQuery = graphql(`
  query BookmarkAddBookmarksList {
    bookmarks {
      __typename
      id
      title
      url
    }
  }
`);
