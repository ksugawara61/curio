import { Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { RecentArticleList } from "../features/recent-article-list";

const ErrorFallback = ({ error }: FallbackProps) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>エラーが発生しました</Text>
    <Text style={styles.errorMessage}>
      {error instanceof Error ? error.message : String(error)}
    </Text>
  </View>
);

const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3b82f6" />
  </View>
);

export default function Index() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingFallback />}>
        <RecentArticleList />
      </Suspense>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  errorMessage: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
});
