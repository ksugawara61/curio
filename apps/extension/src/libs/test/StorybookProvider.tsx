import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import { type FC, type PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../../core/shared/components/ErrorFallback";
import { Loading } from "../../core/shared/components/Loading";

export const StorybookProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ApolloProvider
      client={createGraphQLClient({
        uri: "http://localhost:4000/graphql",
      })}
    >
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Loading />}>
          <div className="w-[400px]">{children}</div>
        </Suspense>
      </ErrorBoundary>
    </ApolloProvider>
  );
};
