import { ClerkProvider } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";
import { ApolloProviderWithAuth } from "../../../libs/apollo-provider-with-auth";
import { AuthGuard } from "../../components/auth-guard";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthGuard>
        <ApolloProviderWithAuth>{children}</ApolloProviderWithAuth>
      </AuthGuard>
    </ClerkProvider>
  );
};
