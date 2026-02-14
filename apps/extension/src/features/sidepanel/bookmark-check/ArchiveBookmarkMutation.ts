import { graphql } from "@curio/graphql-client";

export const ArchiveBookmarkMutation = graphql(`
  mutation ArchiveBookmarkFromCheck($id: String!) {
    archiveBookmark(id: $id) {
      __typename
      archived_at
      id
    }
  }
`);
