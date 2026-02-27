import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
    <ApolloProvider>{children}</ApolloProvider>
  </ClerkProvider>
);
