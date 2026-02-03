import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import { type FC, type PropsWithChildren, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";
import { ErrorFallback } from "../../core/shared/components/ErrorFallback";
import { Loading } from "../../core/shared/components/Loading";
import { BlockedDomainsMocks } from "../../core/shared/hooks/useBlockedDomains.mocks";

export const StorybookProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SWRConfig
      value={{ provider: () => new Map(), fallback: BlockedDomainsMocks.Empty }}
    >
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
    </SWRConfig>
  );
};
