import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <h1 style={{ color: "#4CAF50" }}>Hello World Popup!</h1>
      <p>Welcome to Curio Extension!</p>
      <button className="btn btn-xl" type="button">
        Xlarge
      </button>
    </div>
  );
};
