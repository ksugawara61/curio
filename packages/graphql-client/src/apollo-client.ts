import {
  ApolloClient,
  createHttpLink,
  type DefaultOptions,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

export type GraphQLClientConfig = {
  uri: string;
  getToken?: () => Promise<string | null>;
  headers?: Record<string, string>;
  defaultOptions?: DefaultOptions;
};

export const createGraphQLClient = (config: GraphQLClientConfig) => {
  const httpLink = createHttpLink({
    uri: config.uri,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await config.getToken?.();
    return {
      headers: {
        ...headers,
        ...config.headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
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
