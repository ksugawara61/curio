import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <div className="rounded-lg bg-green-500 p-4 shadow-md">
      <h1 className="prose-h1:prose-base">Hello World Popup!</h1>
      <div className="prose-lg">Welcome to Curio Extension!</div>
      <button className="btn btn-lg" type="submit">
        Xlarge2
      </button>
    </div>
  );
};
