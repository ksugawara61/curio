import { graphql } from "@curio/graphql-client";

export const CreateBookmarkMutation = graphql(`
  mutation CreateBookmark($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
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
