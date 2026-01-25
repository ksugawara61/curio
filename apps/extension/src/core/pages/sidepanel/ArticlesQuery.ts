import { graphql } from "@curio/graphql-client";

export const ArticlesQuery = graphql(`
  query Articles($limit: Number, $offset: Number) {
    articles(limit: $limit, offset: $offset) {
      body
      created_at
      id
      tags {
        name
      }
      title
      updated_at
      url
      user {
        name
      }
    }
  }
`);
