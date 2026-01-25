import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import {
  type RenderOptions,
  type RenderResult,
  render as rtlRender,
} from "@testing-library/react";
import type { ReactElement } from "react";

const createTestClient = () =>
  new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
    cache: new InMemoryCache(),
  });

type TestProviderProps = {
  children: React.ReactNode;
};

const TestProvider = ({ children }: TestProviderProps) => {
  return (
    <ApolloProvider client={createTestClient()}>{children}</ApolloProvider>
  );
};

export const render = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
): RenderResult => {
  return rtlRender(ui, {
    wrapper: TestProvider,
    ...options,
  });
};

export { fireEvent, screen, waitFor, within } from "@testing-library/react";
