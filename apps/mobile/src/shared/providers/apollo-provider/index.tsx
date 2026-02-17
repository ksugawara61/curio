import { useAuth } from "@clerk/clerk-expo";
import {
  createGraphQLClient,
  ApolloProvider as OriginalApolloProvider,
} from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";

const GRAPHQL_URI =
  process.env.EXPO_PUBLIC_GRAPHQL_URI ?? "http://localhost:3000/graphql";

export const ApolloProvider: FC<PropsWithChildren> = ({ children }) => {
  const { getToken } = useAuth();

  const client = useMemo(
    () =>
      createGraphQLClient({
        uri: GRAPHQL_URI,
        getToken,
      }),
    [getToken],
  );

  return (
    <OriginalApolloProvider client={client}>{children}</OriginalApolloProvider>
  );
};
