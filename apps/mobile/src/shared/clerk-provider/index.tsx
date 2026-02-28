import { ClerkProvider as OriginalClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import type { FC, PropsWithChildren } from "react";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const ClerkProvider: FC<PropsWithChildren> = ({ children }) => (
  <OriginalClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    tokenCache={tokenCache}
  >
    {children}
  </OriginalClerkProvider>
);
