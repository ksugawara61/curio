import { Slot } from "expo-router";
import type { FC } from "react";
import { AppProvider } from "../src/shared/providers/app-provider";

const RootLayout: FC = () => {
  return (
    <AppProvider>
      <Slot />
    </AppProvider>
  );
};

export default RootLayout;
