import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentType, ReactElement, ReactNode } from "react";
import { act, Suspense, useMemo } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { SWRConfig } from "swr";

export type TestProviderProps = {
  children: React.ReactNode;
};

const createTestClient = () =>
  new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
    cache: new InMemoryCache(),
  });

/**
 * テスト用のプロバイダーコンポーネント
 * Apollo Client と SWR をテスト用の設定で提供する
 */
export const TestProvider = ({ children }: TestProviderProps) => {
  const swrConfig = useMemo(
    () => ({
      provider: () => new Map(),
    }),
    [],
  );

  return (
    <SWRConfig value={swrConfig}>
      <ApolloProvider client={createTestClient()}>{children}</ApolloProvider>
    </SWRConfig>
  );
};

export type CustomRenderOptions = Omit<RenderOptions, "wrapper">;

/**
 * Testing Library の render 関数のラッパー
 * 自動的に TestProvider でラップする
 */
export const render = (
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
  const user = userEvent.setup();
  const res = rtlRender(ui, {
    wrapper: ({ children }) => <TestProvider>{children}</TestProvider>,
    ...options,
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
    ...renderOptions
  } = options ?? {};

  let result: ReturnType<typeof render> | undefined;
  await act(async () => {
    result = render(
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <Suspense fallback={loadingFallback}>{ui}</Suspense>
      </ErrorBoundary>,
      renderOptions,
    );
  });
  if (!result) throw new Error("render failed");
  return result;
};
