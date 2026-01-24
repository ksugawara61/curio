import { graphql } from "../graphql/graphql";

export const GET_ARTICLES = graphql(`
  query GetArticles($limit: Float, $offset: Float) {
    articles(limit: $limit, offset: $offset) {
      id
      title
      body
      url
      created_at
      updated_at
      user {
        name
      }
      tags {
        name
      }
    }
  }
`);
