import { graphql } from "@curio/graphql-client";

export const DeleteRssFeedMutation = graphql(`
  mutation DeleteRssFeed($id: String!) {
    deleteRssFeed(id: $id)
  }
`);
