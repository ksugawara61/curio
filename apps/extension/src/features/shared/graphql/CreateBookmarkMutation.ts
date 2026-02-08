import { graphql } from "@curio/graphql-client";

export const CreateBookmarkMutation = graphql(`
  mutation CreateBookmark($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
      __typename
      created_at
      description
      id
      note
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
