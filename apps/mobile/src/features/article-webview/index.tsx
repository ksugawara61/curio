import { useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export const ArticleWebView: FC = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
      </View>
      <WebView source={{ uri: url }} style={styles.webview} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#0066cc",
    transform: [{ rotate: "45deg" }],
  },
  webview: {
    flex: 1,
  },
});
