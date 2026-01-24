// Apollo Client
export { createGraphQLClient } from "./apollo-client";
export type { GraphQLClientConfig } from "./apollo-client";

// Apollo Client Hooks
export {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
  ApolloProvider,
} from "@apollo/client/react";

// gql.tada
export { graphql, readFragment } from "./graphql/graphql";
export type { FragmentOf, ResultOf, VariablesOf } from "./graphql/graphql";

// Queries
export { GET_ARTICLES } from "./queries/articles";
