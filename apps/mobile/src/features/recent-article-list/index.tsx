import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MarkArticleAsReadMutation } from "./MarkArticleAsReadMutation";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

type FilterTab = "unread" | "all";

export const RecentArticleList: FC = () => {
  const { data } = useSuspenseQuery(RecentArticlesQuery);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("unread");
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());

  const [markAsRead] = useMutation(MarkArticleAsReadMutation);

  const articles = data?.articles ?? [];

  const isRead = (article: (typeof articles)[number]): boolean => {
    if (!article.id) return false;
    return !!article.read_at || localReadIds.has(article.id);
  };

  const handleArticlePress = (
    url: string | null | undefined,
    articleId: string | null | undefined,
  ) => {
    if (!url) return;
    if (articleId && !localReadIds.has(articleId)) {
      setLocalReadIds((prev) => new Set(prev).add(articleId));
      markAsRead({ variables: { id: articleId } });
    }
    Linking.openURL(url);
  };

  const filteredArticles =
    activeFilter === "unread" ? articles.filter((a) => !isRead(a)) : articles;

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "unread", label: "未読" },
    { id: "all", label: "すべて" },
  ];

  if (articles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📰</Text>
        <Text style={styles.emptyTitle}>記事がありません</Text>
        <Text style={styles.emptySubtitle}>
          拡張機能でRSSフィードを追加すると記事が表示されます
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.tabBar}>
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeFilter === tab.id && styles.tabActive]}
            onPress={() => setActiveFilter(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            {tab.id === "unread" && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {articles.filter((a) => !isRead(a)).length}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {filteredArticles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>✅</Text>
          <Text style={styles.emptyTitle}>未読記事はありません</Text>
        </View>
      ) : (
        <>
          <View style={styles.countRow}>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {filteredArticles.length} articles
              </Text>
            </View>
          </View>
          {filteredArticles.map((article, index) => {
            const read = isRead(article);
            return (
              <Pressable
                key={article.id ?? `${article.url}-${index}`}
                style={[styles.card, read && styles.cardRead]}
                onPress={() => handleArticlePress(article.url, article.id)}
              >
                {article.thumbnail_url && (
                  <Image
                    source={{ uri: article.thumbnail_url }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.cardBody}>
                  <View style={styles.titleRow}>
                    {activeFilter === "all" && (
                      <Text
                        style={[styles.readDot, read && styles.readDotActive]}
                        aria-label={read ? "既読" : "未読"}
                      >
                        {read ? "●" : "○"}
                      </Text>
                    )}
                    <Text
                      style={[styles.title, read && styles.titleRead]}
                      numberOfLines={2}
                    >
                      {article.title}
                    </Text>
                  </View>
                  {article.description && (
                    <Text style={styles.description} numberOfLines={3}>
                      {article.description}
                    </Text>
                  )}
                  {article.pub_date && (
                    <Text style={styles.date}>
                      {new Date(article.pub_date).toLocaleString("ja-JP", {
                        timeZone: "Asia/Tokyo",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 4,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
  },
  tabTextActive: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#374151",
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  badgeText: {
    color: "#f9fafb",
    fontSize: 11,
    fontWeight: "600",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  countBadge: {
    backgroundColor: "#374151",
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countText: {
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f0f4f8",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardRead: {
    backgroundColor: "#e5e7eb",
    opacity: 0.7,
  },
  thumbnail: {
    width: "100%",
    height: 128,
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  readDot: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 2,
  },
  readDotActive: {
    color: "#22c55e",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563eb",
    flex: 1,
  },
  titleRead: {
    color: "#6b7280",
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  date: {
    fontSize: 11,
    color: "#9ca3af",
  },
});
