import { graphql } from "@curio/graphql-client";

export const GetArticles = graphql(`
  query GetArticles($limit: Number, $offset: Number) {
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
