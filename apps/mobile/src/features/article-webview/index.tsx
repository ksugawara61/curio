import { useMutation, useQuery } from "@curio/graphql-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { FC } from "react";
import { useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { BookmarkCheckQuery } from "./BookmarkCheckQuery";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";
import { DeleteBookmarkMutation } from "./DeleteBookmarkMutation";

export const ArticleWebView: FC = () => {
  const { url, title } = useLocalSearchParams<{
    url: string;
    title?: string;
  }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const { data: bookmarkData, refetch } = useQuery(BookmarkCheckQuery, {
    variables: { uri: url },
    skip: !url,
  });

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
  );
  const [deleteBookmark, { loading: deleting }] = useMutation(
    DeleteBookmarkMutation,
  );

  const bookmark = bookmarkData?.bookmark;
  const isBookmarked = !!bookmark;
  const isToggling = creating || deleting;

  const handleToggleBookmark = async () => {
    if (isToggling) return;

    if (isBookmarked && bookmark) {
      await deleteBookmark({ variables: { id: bookmark.id } });
    } else {
      await createBookmark({
        variables: {
          input: {
            url,
            title: title ?? url,
          },
        },
      });
    }
    await refetch();
  };

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
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={handleToggleBookmark}
          disabled={isToggling}
          testID="bookmark-button"
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmarked ? "#6366f1" : "#666666"}
          />
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
    justifyContent: "space-between",
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
  bookmarkButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
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
