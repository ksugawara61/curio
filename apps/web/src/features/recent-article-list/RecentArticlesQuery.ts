import { graphql } from "@curio/graphql-client";

export const RecentArticlesQuery = graphql(`
  query RecentArticlesList {
    recentArticles {
      id
      title
      url
      description
      thumbnail_url
      pub_date
      created_at
      updated_at
    }
  }
`);
