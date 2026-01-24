import { ApolloProvider } from "@apollo/client/react";
import { type RenderOptions, render } from "@testing-library/react";
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

export type RenderWithProvidersOptions = {
  client?: ReturnType<typeof createGraphQLClient>;
} & Omit<RenderOptions, "wrapper">;

/**
 * Testing Library の render 関数のラッパー
 * 自動的に TestProvider でラップする
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions,
) {
  const { client, ...renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProvider client={client}>{children}</TestProvider>
    ),
    ...renderOptions,
  });
}

export type { RenderResult } from "@testing-library/react";
// Re-export commonly used utilities from @testing-library/react
export { fireEvent, screen, waitFor, within } from "@testing-library/react";
