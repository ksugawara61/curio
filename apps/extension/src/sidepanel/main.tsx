import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "./SidePanel";
import "../style.css";

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>,
);
