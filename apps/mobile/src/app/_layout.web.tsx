import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "../../global.css";
import { AppProvider } from "../shared/app-provider";

const NavigationLayout = () => {
  // デフォルトの @expo/vector-icons では Failed to decode downloaded font が発生しフォントが読み込みできない
  // この問題を暫定的に回避するため、expo-font で事前に Ionicons フォントを読み込む
  const [fontsLoaded, fontError] = useFonts({
    Ionicons: require("../../assets/fonts/Ionicons.ttf"),
  });

  if (!fontsLoaded && !fontError) return null;

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
