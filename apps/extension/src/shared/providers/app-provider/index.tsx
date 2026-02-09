import { ClerkProvider } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";
import { AuthGuard } from "../auth-guard";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";

type Props = {
  path: string;
};

export const AppProvider: FC<PropsWithChildren<Props>> = ({
  children,
  path,
}) => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl={path}
      signInForceRedirectUrl={path}
      afterSignOutUrl={path}
    >
      <AuthGuard>
        <ApolloProvider>{children}</ApolloProvider>
      </AuthGuard>
    </ClerkProvider>
  );
};
