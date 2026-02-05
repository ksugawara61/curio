import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { SWRHandler } from "@curio/testing-library";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type Middleware, SWRConfig } from "swr";
import { ErrorFallback } from "../../core/shared/components/ErrorFallback";
import { Loading } from "../../core/shared/components/Loading";

type Props = PropsWithChildren<{
  swrHandlers?: SWRHandler[];
}>;

const createSWRMockMiddleware = (handlers?: SWRHandler[]): Middleware[] => {
  if (!handlers || handlers.length === 0) {
    return [];
  }

  return handlers.map<Middleware>((handler) => {
    return (useSWRNext) => {
      return (k, fetcher, config) => {
        if (k === handler.key) {
          return {
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            data: handler.data as any,
            error: undefined,
            isValidating: false,
            isLoading: false,
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            mutate: () => Promise.resolve(handler.data as any),
          };
        }
        return useSWRNext(k, fetcher, config);
      };
    };
  });
};

export const StorybookProvider: FC<Props> = ({ children, swrHandlers }) => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        use: createSWRMockMiddleware(swrHandlers),
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
