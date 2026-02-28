import type { FC, PropsWithChildren } from "react";
import { ApolloProvider } from "../apollo-provider";
import { AuthGuard } from "../auth-guard";
import { ClerkProvider } from "../clerk-provider";
import { GluestackUIProvider } from "../gluestack-ui-provider";

export const AppProvider: FC<PropsWithChildren> = ({ children }) => (
  <GluestackUIProvider mode="light">
    <ClerkProvider>
      <AuthGuard>
        <ApolloProvider>{children}</ApolloProvider>
      </AuthGuard>
    </ClerkProvider>
  </GluestackUIProvider>
);
