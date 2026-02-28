import { graphql } from "@curio/graphql-client";

export const DeleteBookmarkMutation = graphql(`
  mutation ArticleWebViewDeleteBookmark($id: String!) {
    deleteBookmark(id: $id)
  }
`);
