import { ApolloProvider } from "@curio/graphql-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "../../core/pages/sidepanel";
import { AuthGuard } from "../../core/shared/components/AuthGuard";
import { apolloClient } from "../../libs/apollo-client";
import "../style.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthGuard>
        <SidePanel />
      </AuthGuard>
    </ApolloProvider>
  </React.StrictMode>,
);
