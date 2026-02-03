import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";
import { ErrorFallback } from "../../core/shared/components/ErrorFallback";
import { Loading } from "../../core/shared/components/Loading";
import { BlockedDomainsMocks } from "../../core/shared/hooks/useBlockedDomains.mocks";

type Props = PropsWithChildren<{
  swrFallback?: Record<string, unknown>;
}>;

export const StorybookProvider: FC<Props> = ({ children, swrFallback }) => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fallback: { ...BlockedDomainsMocks.Empty, ...swrFallback },
      }}
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
