import { useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export const ArticleWebView: FC = () => {
  const { url } = useLocalSearchParams<{ url: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleLoadProgress = ({
    nativeEvent,
  }: {
    nativeEvent: { progress: number };
  }) => {
    Animated.timing(progressAnim, {
      toValue: nativeEvent.progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const handleLoadEnd = () => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setIsLoading(false);
      progressAnim.setValue(0);
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

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
      {isLoading && (
        <View style={styles.progressBarTrack}>
          <Animated.View
            style={[styles.progressBarFill, { width: progressWidth }]}
          />
        </View>
      )}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onLoadProgress={handleLoadProgress}
        onLoadEnd={handleLoadEnd}
        onLoadStart={() => setIsLoading(true)}
      />
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
  progressBarTrack: {
    height: 3,
    backgroundColor: "#e5e5e5",
  },
  progressBarFill: {
    height: 3,
    backgroundColor: "#0066cc",
  },
});
