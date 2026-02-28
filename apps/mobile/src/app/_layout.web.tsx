import { Stack } from "expo-router";
import "../../global.css";
import { AppProvider } from "../shared/app-provider";

const NavigationLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(home)" />
      <Stack.Screen name="article-webview" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AppProvider>
      <NavigationLayout />
    </AppProvider>
  );
}
