import { graphql } from "@curio/graphql-client";

export const MarkArticleAsReadMutation = graphql(`
  mutation RecentArticleListMarkArticleAsRead($id: String!) {
    markArticleAsRead(id: $id) {
      id
      read_at
    }
  }
`);
