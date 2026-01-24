import {
  ApolloClient,
  createHttpLink,
  type DefaultOptions,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export type GraphQLClientConfig = {
  uri: string;
  headers?: Record<string, string>;
  defaultOptions?: DefaultOptions;
};

export function createGraphQLClient(config: GraphQLClientConfig) {
  const httpLink = createHttpLink({
    uri: config.uri,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...config.headers,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: config.defaultOptions ?? {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}
