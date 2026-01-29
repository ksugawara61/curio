import { graphql } from "@curio/graphql-client";

export const UpdateBookmarkMutation = graphql(`
  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {
    updateBookmark(id: $id, input: $input) {
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
