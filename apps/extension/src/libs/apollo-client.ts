import { createGraphQLClient } from "@curio/graphql-client";

export const apolloClient = createGraphQLClient({
  uri: "http://localhost:3000/graphql",
  headers: {
    "X-Test-Key": "test-key",
  },
});
