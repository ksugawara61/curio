import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const client = createGraphQLClient({
  uri: "http://localhost:3000/graphql",
});

export const StorybookProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloProvider client={client}>
      <ErrorBoundary fallback={<div className="text-error p-4">Error</div>}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </ApolloProvider>
  );
};
