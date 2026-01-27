// Apollo Client

// Apollo Client Hooks
export {
  ApolloProvider,
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
  useSuspenseQuery,
} from "@apollo/client/react";
export type { GraphQLClientConfig } from "./apollo-client";
export { createGraphQLClient } from "./apollo-client";
export type { FragmentOf, ResultOf, VariablesOf } from "./graphql/graphql";
// gql.tada
export { graphql, readFragment } from "./graphql/graphql";
