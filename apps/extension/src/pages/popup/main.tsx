import { ApolloProvider } from "@curio/graphql-client";
import React from "react";
import ReactDOM from "react-dom/client";
import { Popup } from "../../core/pages/popup";
import { apolloClient } from "../../libs/apollo-client";
import "../style.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Popup />
    </ApolloProvider>
  </React.StrictMode>,
);
