import { graphql } from "@curio/graphql-client";

export const RecentArticlesQuery = graphql(`
  query RecentArticlesList {
    articles(input: { source: database, hours: 240 }) {
      __typename
      description
      id
      pub_date
      read_at
      thumbnail_url
      title
      url
    }
  }
`);
