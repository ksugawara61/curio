import { Button, Typography } from "@curio/ui";
import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <div className="rounded-lg bg-green-500 p-4 shadow-md">
      <Typography as="h1">Hello World Popup!</Typography>
      <Typography size="lg">Welcome to Curio Extension!</Typography>
      <Button size="xl">Xlarge</Button>
    </div>
  );
};
