import { graphql } from "@curio/graphql-client";

export const UpdateBookmarkMutation = graphql(`
  mutation UpdateBookmark($id: String!, $input: UpdateBookmarkInputInput!) {
    updateBookmark(id: $id, input: $input) {
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
