import { ClerkProvider } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";
import { AuthGuard } from "../auth-guard";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthGuard>
        <ApolloProvider>{children}</ApolloProvider>
      </AuthGuard>
    </ClerkProvider>
  );
};
