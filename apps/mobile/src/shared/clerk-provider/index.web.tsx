import { ClerkProvider as OriginalClerkProvider } from "@clerk/clerk-react";
import type { FC, PropsWithChildren } from "react";

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

export const ClerkProvider: FC<PropsWithChildren> = ({ children }) => (
  <OriginalClerkProvider publishableKey={PUBLISHABLE_KEY}>
    {children}
  </OriginalClerkProvider>
);
