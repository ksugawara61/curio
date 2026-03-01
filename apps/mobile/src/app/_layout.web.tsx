import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
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
  const [fontsLoaded, fontError] = useFonts(Ionicons.font);

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppProvider>
      <NavigationLayout />
    </AppProvider>
  );
}
