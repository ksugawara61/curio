import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#4CAF50" }}>Hello World</h1>
      <p>Welcome to Curio Extension!</p>
    </div>
  );
}

// biome-ignore lint/style/noNonNullAssertion: root element is guaranteed to exist
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
