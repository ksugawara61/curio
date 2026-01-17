import type { FC } from "react";

export const SidePanel: FC = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="rounded-lg bg-base-100 p-6 shadow-xl">
        <div className="font-bold text-2xl">Curio Side Panel2</div>
        <div>Welcome to Curio Side Panel!</div>
        <div className="flex flex-col gap-2">
          <button className="btn btn-primary" type="submit">
            Primary Action
          </button>
          <button className="btn btn-secondary" type="submit">
            Secondary Action
          </button>
          <button className="btn btn-xl" type="submit">
            Xlarge
          </button>
        </div>
      </div>
    </div>
  );
};
