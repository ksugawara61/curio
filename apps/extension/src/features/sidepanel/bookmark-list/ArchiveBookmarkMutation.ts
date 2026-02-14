import { graphql } from "@curio/graphql-client";

export const ArchiveBookmarkMutation = graphql(`
  mutation ArchiveBookmark($id: String!) {
    archiveBookmark(id: $id) {
      __typename
      archived_at
      id
    }
  }
`);
