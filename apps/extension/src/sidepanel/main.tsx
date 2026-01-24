import { ApolloProvider } from "@apollo/client/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { apolloClient } from "../lib/apollo-client";
import { SidePanel } from "./SidePanel";
import "../style.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <SidePanel />
    </ApolloProvider>
  </React.StrictMode>,
);
