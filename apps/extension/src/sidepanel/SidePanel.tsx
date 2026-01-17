import { Button, Typography } from "@curio/ui";
import type { FC } from "react";

export const SidePanel: FC = () => {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="rounded-lg bg-base-100 p-6 shadow-xl">
        <Typography as="h1" className="mb-4 font-bold text-2xl">
          Curio Side Panel
        </Typography>
        <Typography className="mb-4">Welcome to Curio Side Panel!</Typography>
        <div className="space-y-2">
          <Button block variant="primary">
            Primary Action
          </Button>
          <Button block variant="secondary">
            Secondary Action
          </Button>
        </div>
      </div>
    </div>
  );
};
