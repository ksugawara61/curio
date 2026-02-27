import { Stack } from "expo-router";
import { AppProvider } from "../shared/providers/app-provider";

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack />
    </AppProvider>
  );
}
