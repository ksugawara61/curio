import { graphql } from "@curio/graphql-client";

export const BookmarkCheckQuery = graphql(`
  query ArticleWebViewBookmarkCheck($uri: String!) {
    bookmark(uri: $uri) {
      __typename
      id
      title
      url
    }
  }
`);
