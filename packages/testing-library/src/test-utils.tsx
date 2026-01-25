import type { ApolloClient } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import type { ReactElement } from "react";

export type TestProviderProps = {
  children: React.ReactNode;
  client: ApolloClient;
};

/**
 * テスト用のプロバイダーコンポーネント
 * Apollo Client をテスト用の設定で提供する
 */
export function TestProvider({ children, client }: TestProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export type CustomRenderOptions = {
  client: ApolloClient;
} & Omit<RenderOptions, "wrapper">;

/**
 * Testing Library の render 関数のラッパー
 * 自動的に TestProvider でラップする
 */
export function render(
  ui: ReactElement,
  options: CustomRenderOptions,
): RenderResult {
  const { client, ...renderOptions } = options;

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
