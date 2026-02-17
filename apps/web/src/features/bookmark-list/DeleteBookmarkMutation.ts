import { graphql } from "@curio/graphql-client";

export const DeleteBookmarkMutation = graphql(`
  mutation DeleteBookmark($id: String!) {
    deleteBookmark(id: $id)
  }
`);
