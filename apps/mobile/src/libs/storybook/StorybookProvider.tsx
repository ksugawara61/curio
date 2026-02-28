import { ApolloProvider, createGraphQLClient } from "@curio/graphql-client";
import type { FC, PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GluestackUIProvider } from "../../shared/gluestack-ui-provider";

const ErrorFallback = () => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>エラーが発生しました</Text>
  </View>
);

const Loading = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0066cc" />
  </View>
);

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#c53030",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const StorybookProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <GluestackUIProvider mode="light">
      <ApolloProvider
        client={createGraphQLClient({
          uri: "http://localhost:4000/graphql",
        })}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>{children}</Suspense>
        </ErrorBoundary>
      </ApolloProvider>
    </GluestackUIProvider>
  );
};
