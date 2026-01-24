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
// MSW utilities for testing
export { createMockMutation, createMockQuery } from "./msw-utils";
// Queries
export { GET_ARTICLES } from "./queries/articles";
export type {
  RenderWithProvidersOptions,
  TestProviderProps,
} from "./test-utils";
// Test utilities
export {
  fireEvent,
  renderWithProviders,
  screen,
  TestProvider,
  waitFor,
  within,
} from "./test-utils";
