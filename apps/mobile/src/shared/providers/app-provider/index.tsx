import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-expo";
import type { FC, PropsWithChildren } from "react";
import { tokenCache } from "../../../libs/clerk-token-cache";
import { ApolloProvider } from "../apollo-provider";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ApolloProvider>{children}</ApolloProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
};
