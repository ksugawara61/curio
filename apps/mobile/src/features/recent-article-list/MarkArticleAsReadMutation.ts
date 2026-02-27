import { graphql } from "@curio/graphql-client";

export const MarkArticleAsReadMutation = graphql(`
  mutation MarkArticleAsRead($id: String!) {
    markArticleAsRead(id: $id) {
      id
      read_at
    }
  }
`);
