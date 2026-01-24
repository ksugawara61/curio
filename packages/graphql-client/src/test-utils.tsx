import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import type { ReactElement } from "react";
import { createGraphQLClient } from "./apollo-client";

export type TestProviderProps = {
  children: React.ReactNode;
  client?: ReturnType<typeof createGraphQLClient>;
};

/**
 * テスト用のプロバイダーコンポーネント
 * Apollo Client をテスト用の設定で提供する
 */
export function TestProvider({ children, client }: TestProviderProps) {
  const testClient =
    client ??
    createGraphQLClient({
      uri: "http://localhost:4000/graphql",
    });

  return <ApolloProvider client={testClient}>{children}</ApolloProvider>;
}

export type CustomRenderOptions = {
  client?: ReturnType<typeof createGraphQLClient>;
} & Omit<RenderOptions, "wrapper">;

/**
 * Testing Library の render 関数のラッパー
 * 自動的に TestProvider でラップする
 */
export function render(
  ui: ReactElement,
  options?: CustomRenderOptions,
): RenderResult {
  const { client, ...renderOptions } = options ?? {};

  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <TestProvider client={client}>{children}</TestProvider>
    ),
    ...renderOptions,
  });
}

// Re-export commonly used utilities from @testing-library/react
export { fireEvent, screen, waitFor, within } from "@testing-library/react";
export type { RenderResult };
