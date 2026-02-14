import { graphql } from "@curio/graphql-client";

export const RssArticlesQuery = graphql(`
  query RssArticlesList($id: String!) {
    rssArticles(id: $id) {
      __typename
      description
      link
      pubDate
      thumbnailUrl
      title
    }
  }
`);
