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
  getHeaders?: () => Promise<Record<string, string>> | Record<string, string>;
  defaultOptions?: DefaultOptions;
};

export const createGraphQLClient = (config: GraphQLClientConfig) => {
  const httpLink = createHttpLink({
    uri: config.uri,
  });

  const authLink = setContext(async (_, { headers }) => {
    const dynamicHeaders = config.getHeaders ? await config.getHeaders() : {};
    return {
      headers: {
        ...headers,
        ...config.headers,
        ...dynamicHeaders,
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
};
