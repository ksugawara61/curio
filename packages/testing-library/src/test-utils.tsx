import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

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
 * Apollo Client をテスト用の設定で提供する
 */
export const TestProvider = ({ children }: TestProviderProps) => (
  <ApolloProvider client={createTestClient()}>{children}</ApolloProvider>
);

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
