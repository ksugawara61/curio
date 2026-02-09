import { ClerkProvider } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";
import { AuthGuard } from "../auth-guard";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";
const SYNC_HOST = import.meta.env.VITE_CLERK_SYNC_HOST as string | undefined;

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/sidepanel/index.html"
      signInFallbackRedirectUrl="/sidepanel/index.html"
      signUpFallbackRedirectUrl="/sidepanel/index.html"
      {...(SYNC_HOST ? { syncHost: SYNC_HOST } : {})}
    >
      <AuthGuard>
        <ApolloProvider>{children}</ApolloProvider>
      </AuthGuard>
    </ClerkProvider>
  );
};
