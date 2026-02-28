import { useAuth } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import "../../global.css";
import { AppProvider } from "../shared/app-provider";
import { GluestackUIProvider } from "../shared/gluestack-ui-provider";

const NavigationLayout = () => {
  const { isSignedIn = false } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)/sign-in" />
        <Stack.Screen name="(auth)/sign-up" />
      </Stack.Protected>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(home)/index" />
        <Stack.Screen name="(home)/bookmark-list" />
        <Stack.Screen name="article-webview" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="light">
      <AppProvider>
        <NavigationLayout />
      </AppProvider>
    </GluestackUIProvider>
  );
}
