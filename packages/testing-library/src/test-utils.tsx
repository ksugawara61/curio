import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType, ReactElement, ReactNode } from "react";
import { act, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { type Middleware, SWRConfig } from "swr";
import type { SWRHandler } from "./swr-utils";

export type TestProviderProps = {
  children: React.ReactNode;
  /** @deprecated Use swrHandlers instead */
  swrFallback?: Record<string, unknown>;
  swrHandlers?: SWRHandler[];
};

const createTestClient = () =>
  new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
    cache: new InMemoryCache(),
  });

/**
 * SWR ハンドラーからミドルウェアを作成
 * suspense モードでも正しく動作する
 */
const createSWRMiddleware = (handlers?: SWRHandler[]): Middleware[] => {
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

/**
 * テスト用のプロバイダーコンポーネント
 * Apollo Client と SWR をテスト用の設定で提供する
 */
export const TestProvider = ({
  children,
  // Deprecated: kept for backwards compatibility
  swrFallback: _swrFallback = {},
  swrHandlers,
}: TestProviderProps) => {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        use: createSWRMiddleware(swrHandlers),
      }}
    >
      <ApolloProvider client={createTestClient()}>{children}</ApolloProvider>
    </SWRConfig>
  );
};

export type CustomRenderOptions = Omit<RenderOptions, "wrapper"> & {
  /** @deprecated Use swrHandlers instead */
  swrFallback?: Record<string, unknown>;
  swrHandlers?: SWRHandler[];
};

/**
 * Testing Library の render 関数のラッパー
 * 自動的に TestProvider でラップする
 */
export const render = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
  const { swrFallback, swrHandlers, ...renderOptions } = options ?? {};
  const user = userEvent.setup();
  const res = rtlRender(ui, {
    wrapper: ({ children }) => (
      <TestProvider swrFallback={swrFallback} swrHandlers={swrHandlers}>
        {children}
      </TestProvider>
    ),
    ...renderOptions,
  });
  return { ...res, user };
};

// Re-export commonly used utilities from @testing-library/react
export { fireEvent, screen, waitFor, within } from "@testing-library/react";
export type { RenderResult };

/**
 * Default loading fallback component for Suspense
 */
const DefaultLoadingFallback = () => <div>Loading...</div>;

/**
 * Default error fallback component for ErrorBoundary
 */
const DefaultErrorFallback = ({ error }: FallbackProps) => (
  <div>Error: {error instanceof Error ? error.message : String(error)}</div>
);

export type RenderSuspenseOptions = {
  loadingFallback?: ReactNode;
  errorFallback?: ComponentType<FallbackProps>;
};

/**
 * Suspense と ErrorBoundary でラップしてレンダリングするユーティリティ
 * useSuspenseQuery を使用するコンポーネントのテストに使用
 */
export const renderSuspense = async (
  ui: ReactElement,
  options?: RenderSuspenseOptions & CustomRenderOptions,
): Promise<RenderResult & { user: ReturnType<typeof userEvent.setup> }> => {
  const {
    loadingFallback = <DefaultLoadingFallback />,
    errorFallback: ErrorFallbackComponent = DefaultErrorFallback,
    swrFallback,
    swrHandlers,
    ...renderOptions
  } = options ?? {};

  const user = userEvent.setup();
  let result: RenderResult | undefined;
  await act(async () => {
    result = rtlRender(
      <TestProvider swrFallback={swrFallback} swrHandlers={swrHandlers}>
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
          <Suspense fallback={loadingFallback}>{ui}</Suspense>
        </ErrorBoundary>
      </TestProvider>,
      renderOptions,
    );
  });
  if (!result) throw new Error("render failed");
  return { ...result, user };
};
