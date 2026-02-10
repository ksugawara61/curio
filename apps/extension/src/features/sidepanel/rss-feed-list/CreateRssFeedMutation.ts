import { graphql } from "@curio/graphql-client";

export const CreateRssFeedMutation = graphql(`
  mutation CreateRssFeed($url: String!) {
    createRssFeed(url: $url) {
      __typename
      created_at
      description
      id
      title
      updated_at
      url
    }
  }
`);
