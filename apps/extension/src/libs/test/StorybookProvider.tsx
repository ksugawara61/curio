import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type Middleware, SWRConfig } from "swr";
import { ErrorFallback } from "../../core/shared/components/ErrorFallback";
import { Loading } from "../../core/shared/components/Loading";

type Props = PropsWithChildren<{
  swrMock?: Record<string, unknown>;
}>;

const createSWRMockMiddleware = (
  swrMock?: Record<string, unknown>,
): Middleware[] => {
  if (!swrMock) {
    return [];
  }

  return Object.entries(swrMock).map<Middleware>(([key, value]) => {
    return (useSWRNext) => {
      return (k, fetcher, config) => {
        if (k === key) {
          return {
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            data: value as any,
            error: undefined,
            isValidating: false,
            isLoading: false,
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            mutate: () => Promise.resolve(value as any),
          };
        }
        return useSWRNext(k, fetcher, config);
      };
    };
  });
};

export const StorybookProvider: FC<Props> = ({ children, swrMock }) => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        use: createSWRMockMiddleware(swrMock),
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
