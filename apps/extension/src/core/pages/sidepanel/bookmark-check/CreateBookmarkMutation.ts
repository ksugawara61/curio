import { graphql } from "@curio/graphql-client";

export const CreateBookmarkMutation = graphql(`
  mutation CreateBookmark($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
      __typename
      id
      title
      url
      description
      created_at
      updated_at
      tags {
        id
        name
      }
    }
  }
`);
