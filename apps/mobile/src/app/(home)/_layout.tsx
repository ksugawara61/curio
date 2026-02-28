import { useClerk, useUser } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeHeader = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-background-0 border-b border-background-200"
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 gap-0.5">
          <Text className="text-lg font-bold text-typography-900">Curio</Text>
          <Text className="text-[13px] text-typography-500">
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>
        <Pressable
          className="px-3 py-1.5 bg-background-100 rounded-lg active:opacity-70"
          onPress={handleSignOut}
        >
          <Text className="text-sm text-typography-700">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default function HomeLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <HomeHeader />,
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "記事",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reader-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmark-list"
        options={{
          title: "ブックマーク",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
