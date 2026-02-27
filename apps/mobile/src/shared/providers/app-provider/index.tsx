import { ClerkProvider } from "@clerk/clerk-react";
import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <ApolloProvider>{children}</ApolloProvider>
  </ClerkProvider>
);
