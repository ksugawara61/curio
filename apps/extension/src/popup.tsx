import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <div
      style={{
        width: "300px",
        padding: "20px",
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#4CAF50" }}>Hello World Popup!</h1>
      <p>Welcome to Curio Extension!</p>
    </div>
  );
};
