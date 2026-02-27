import { graphql } from "@curio/graphql-client";

export const ArchivedBookmarksQuery = graphql(`
  query ArchivedBookmarksList {
    archivedBookmarks {
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
