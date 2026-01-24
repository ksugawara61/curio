// Apollo Client

// Apollo Client Hooks
export {
  ApolloProvider,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client/react";
export type { GraphQLClientConfig } from "./apollo-client";
export { createGraphQLClient } from "./apollo-client";
export type { FragmentOf, ResultOf, VariablesOf } from "./graphql/graphql";
// gql.tada
export { graphql, readFragment } from "./graphql/graphql";

// Queries
export { GET_ARTICLES } from "./queries/articles";

// MSW utilities for testing
export { createMockMutation, createMockQuery } from "./msw-utils";
