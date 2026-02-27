import { useClerk, useUser } from "@clerk/clerk-expo";
import { useQuery } from "@curio/graphql-client";
import * as Linking from "expo-linking";
import type { FC } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

type Article = {
  id: string;
  title: string;
  description: string | null | undefined;
  url: string;
  thumbnail_url: string | null | undefined;
  pub_date: string | null | undefined;
};

const SignOutButton = () => {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    try {
      await signOut();
      Linking.openURL(Linking.createURL("/"));
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return <Button title="Sign out" onPress={handleSignOut} />;
};

const ArticleItem: FC<{ item: Article }> = ({ item }) => (
  <TouchableOpacity
    style={styles.articleCard}
    onPress={() => Linking.openURL(item.url)}
    activeOpacity={0.7}
  >
    {item.thumbnail_url ? (
      <Image
        source={{ uri: item.thumbnail_url }}
        style={styles.thumbnail}
        resizeMode="cover"
      />
    ) : (
      <View style={styles.thumbnailPlaceholder} />
    )}
    <View style={styles.articleContent}>
      <Text style={styles.articleTitle} numberOfLines={2}>
        {item.title}
      </Text>
      {item.description ? (
        <Text style={styles.articleDescription} numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}
      {item.pub_date ? (
        <Text style={styles.articleDate}>
          {new Date(item.pub_date).toLocaleDateString("ja-JP")}
        </Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

export const RecentArticleList: FC = () => {
  const { user } = useUser();
  const { data, error, loading } = useQuery(RecentArticlesQuery);

  const articles = (data?.articles ?? []) as Article[];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Welcome!!</Text>
          <Text style={styles.email}>
            {user?.emailAddresses[0].emailAddress}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <SignOutButton />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>エラーが発生しました</Text>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleItem item={item} />}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>記事がありません</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  email: {
    fontSize: 13,
    color: "#666666",
  },
  buttonContainer: {
    marginLeft: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginLeft: 92,
  },
  articleCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    flexShrink: 0,
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
    flexShrink: 0,
  },
  articleContent: {
    flex: 1,
    gap: 4,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 20,
  },
  articleDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 18,
  },
  articleDate: {
    fontSize: 12,
    color: "#999999",
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 12,
  },
  loadingText: {
    color: "#666666",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#fff5f5",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#feb2b2",
    gap: 8,
    width: "100%",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#c53030",
  },
  errorText: {
    color: "#c53030",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
  },
});
