import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";

export const StorybookProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloProvider
      client={createGraphQLClient({
        uri: "http://localhost:4000/graphql",
      })}
    >
      {children}
    </ApolloProvider>
  );
};
