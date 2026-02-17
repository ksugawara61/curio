import type { FC } from "react";
import { Suspense } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { BookmarkList } from "../src/features/bookmark-list";
import { ErrorFallback } from "../src/shared/components/error-fallback";
import { Loading } from "../src/shared/components/loading";

const HomeScreen: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ErrorFallback>
        <Suspense fallback={<Loading />}>
          <BookmarkList />
        </Suspense>
      </ErrorFallback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});

export default HomeScreen;
