import { ClerkProvider } from "@clerk/chrome-extension";
import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "../../core/features/popup";
import { AuthGuard } from "../../core/shared/components/auth-guard";
import { ApolloProviderWithAuth } from "../../libs/apollo-provider-with-auth";
import "../style.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? "";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthGuard>
        <ApolloProviderWithAuth>
          <Popup />
        </ApolloProviderWithAuth>
      </AuthGuard>
    </ClerkProvider>
  </React.StrictMode>,
);
