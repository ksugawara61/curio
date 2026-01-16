import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <div className="rounded-lg bg-green-500 p-4 shadow-md">
      <h1 className="prose">Hello World Popup!</h1>
      <p className="prose lg:prose-x">Welcome to Curio Extension!</p>
      <button className="btn btn-xl" type="button">
        Xlarge
      </button>
    </div>
  );
};
