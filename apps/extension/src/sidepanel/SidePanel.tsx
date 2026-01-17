import { Button, Typography, VStack } from "@curio/ui";
import type { FC } from "react";

export const SidePanel: FC = () => {
  return (
    <VStack className="min-h-screen bg-base-200" p={6}>
      <VStack className="rounded-lg bg-base-100 shadow-xl" p={6} spacing={4}>
        <Typography as="h1" className="font-bold text-2xl">
          Curio Side Panel
        </Typography>
        <Typography>Welcome to Curio Side Panel!</Typography>
        <VStack spacing={2}>
          <Button block variant="primary">
            Primary Action
          </Button>
          <Button block variant="secondary">
            Secondary Action
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};
