import type { FC } from "react";

export const Loading: FC = () => {
  return (
    <div className="flex justify-center p-8">
      <span className="loading loading-spinner loading-lg" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
