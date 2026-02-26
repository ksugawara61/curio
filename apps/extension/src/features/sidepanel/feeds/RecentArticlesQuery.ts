import { graphql } from "@curio/graphql-client";

export const RecentArticlesQuery = graphql(`
  query RecentArticlesList {
    articles(input: { source: database }) {
      __typename
      description
      id
      pub_date
      thumbnail_url
      title
      url
    }
  }
`);
