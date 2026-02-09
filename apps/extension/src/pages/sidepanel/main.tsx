import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "../../features/sidepanel";
import "../style.css";
import { AppProvider } from "../../shared/providers/app-provider";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider path="/sidepanel/index.html">
      <SidePanel />
    </AppProvider>
  </React.StrictMode>,
);
