import { graphql } from "@curio/graphql-client";

export const CreateBookmarkMutation = graphql(`
  mutation CreateBookmarkFromWeb($input: CreateBookmarkInputInput!) {
    createBookmark(input: $input) {
      __typename
      archived_at
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
