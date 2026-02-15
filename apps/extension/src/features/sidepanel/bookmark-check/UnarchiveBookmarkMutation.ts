import { graphql } from "@curio/graphql-client";

export const UnarchiveBookmarkMutation = graphql(`
  mutation UnarchiveBookmarkFromCheck($id: String!) {
    unarchiveBookmark(id: $id) {
      __typename
      archived_at
      id
    }
  }
`);
