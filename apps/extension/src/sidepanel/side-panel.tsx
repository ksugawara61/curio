import type { FC } from "react";

export const SidePanel: FC = () => {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="rounded-lg bg-base-100 p-6 shadow-xl">
        <h1 className="prose mb-4 font-bold text-2xl">Curio Side Panel</h1>
        <p className="prose mb-4">Welcome to Curio Side Panel!</p>
        <div className="space-y-2">
          <button className="btn btn-primary btn-block" type="button">
            Primary Action
          </button>
          <button className="btn btn-secondary btn-block" type="button">
            Secondary Action
          </button>
        </div>
      </div>
    </div>
  );
};
