import { ApolloProvider } from "@curio/graphql-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "../../core/pages/popup";
import { apolloClient } from "../../libs/apollo-client";
import "../style.css";
import { AuthGuard } from "../../core/shared/components/auth-guard";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthGuard>
      <ApolloProvider client={apolloClient}>
        <Popup />
      </ApolloProvider>
    </AuthGuard>
  </React.StrictMode>,
);
