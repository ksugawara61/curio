import { graphql } from "@curio/graphql-client";

export const RssFeedsQuery = graphql(`
  query RssFeedsList {
    rssFeeds {
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
