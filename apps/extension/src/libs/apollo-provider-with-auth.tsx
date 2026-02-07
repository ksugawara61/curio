import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { useAuth } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";

const GRAPHQL_URI =
  import.meta.env.VITE_GRAPHQL_URI ?? "http://localhost:3000/graphql";

export const ApolloProviderWithAuth: FC<PropsWithChildren> = ({ children }) => {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const httpLink = createHttpLink({
      uri: GRAPHQL_URI,
    });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
