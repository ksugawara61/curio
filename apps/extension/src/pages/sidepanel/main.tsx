import { ApolloProvider } from "@curio/graphql-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "../../core/pages/sidepanel";
import { apolloClient } from "../../libs/apollo-client";
import "../style.css";
import { AuthGuard } from "../../core/shared/components/auth-guard";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthGuard>
      <ApolloProvider client={apolloClient}>
        <SidePanel />
      </ApolloProvider>
    </AuthGuard>
  </React.StrictMode>,
);
