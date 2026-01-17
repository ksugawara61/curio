import { Typography, VStack } from "@curio/ui";
import type { FC } from "react";

export const Popup: FC = () => {
  return (
    <VStack className="rounded-lg bg-green-500 shadow-md" p={4}>
      <Typography as="h1">Hello World Popup!</Typography>
      <Typography size="lg">Welcome to Curio Extension!</Typography>
      <button className="btn btn-lg" type="submit">
        Xlarge2
      </button>
    </VStack>
  );
};
