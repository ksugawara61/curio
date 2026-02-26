import { graphql } from "@curio/graphql-client";

export const RssArticlesQuery = graphql(`
  query RssArticlesList($feedId: String!) {
    articles(input: { source: rss, feedId: $feedId }) {
      __typename
      id
      description
      pub_date
      thumbnail_url
      title
      url
    }
  }
`);
