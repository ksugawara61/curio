import { useMutation, useQuery } from "@curio/graphql-client";
import { useRouter } from "expo-router";
import { type FC, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { MarkArticleAsReadMutation } from "./MarkArticleAsReadMutation";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

type FilterTab = "unread" | "all";

type Article = {
  id: string;
  title: string;
  description: string | null | undefined;
  url: string;
  thumbnail_url: string | null | undefined;
  pub_date: string | null | undefined;
  read_at: string | null | undefined;
};

type ArticleItemProps = {
  item: Article;
  isRead: boolean;
  showReadIndicator: boolean;
  onPress: () => void;
};

const ArticleItem: FC<ArticleItemProps> = ({
  item,
  isRead,
  showReadIndicator,
  onPress,
}) => {
  return (
    <Pressable
      className={`flex-row px-4 py-3 gap-3 active:opacity-70 ${isRead ? "bg-background-100" : "bg-background-0"}`}
      onPress={onPress}
    >
      {item.thumbnail_url ? (
        <Image
          source={{ uri: item.thumbnail_url }}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-16 h-16 rounded-lg bg-background-200" />
      )}
      <View className="flex-1 gap-1">
        <View className="flex-row items-start gap-1">
          {showReadIndicator && (
            <Text
              className={`text-base leading-5 ${isRead ? "text-success-500" : "text-typography-300"}`}
              accessibilityLabel={isRead ? "既読" : "未読"}
            >
              {isRead ? "●" : "○"}
            </Text>
          )}
          <Text
            className={`flex-1 text-[15px] font-semibold leading-5 ${isRead ? "text-typography-400" : "text-typography-900"}`}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>
        {item.description ? (
          <Text
            className="text-sm text-typography-500 leading-[18px]"
            numberOfLines={2}
          >
            {item.description}
          </Text>
        ) : null}
        {item.pub_date ? (
          <Text className="text-xs text-typography-400 mt-0.5">
            {new Date(item.pub_date).toLocaleDateString("ja-JP")}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
};

export const RecentArticleList: FC = () => {
  const { data, error, loading } = useQuery(RecentArticlesQuery);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("unread");
  const [localReadIds, setLocalReadIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const [markAsRead] = useMutation(MarkArticleAsReadMutation);

  const articles = (data?.articles ?? []) as Article[];

  const isArticleRead = (article: Article): boolean => {
    return !!article.read_at || localReadIds.has(article.id);
  };

  const handlePress = (article: Article) => {
    if (!localReadIds.has(article.id) && !article.read_at) {
      setLocalReadIds((prev) => new Set(prev).add(article.id));
      markAsRead({ variables: { id: article.id } });
    }

    if (Platform.OS === "web") {
      window.open(article.url, "_blank", "noopener,noreferrer");
      return;
    }
    router.push({
      pathname: "/article-webview",
      params: { url: article.url, title: article.title },
    });
  };

  const unreadCount = articles.filter((a) => !isArticleRead(a)).length;

  const filteredArticles =
    activeFilter === "unread"
      ? articles.filter((a) => !isArticleRead(a))
      : articles;

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: "unread", label: "未読" },
    { id: "all", label: "すべて" },
  ];

  return (
    <View className="flex-1 bg-background-50">
      <View className="flex-row border-b border-background-200 bg-background-0">
        {filterTabs.map((tab) => (
          <Pressable
            key={tab.id}
            className={`flex-1 py-3 items-center justify-center flex-row gap-1 border-b-2 ${
              activeFilter === tab.id
                ? "border-primary-500"
                : "border-transparent"
            }`}
            onPress={() => setActiveFilter(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeFilter === tab.id }}
          >
            <Text
              className={`text-sm font-medium ${
                activeFilter === tab.id
                  ? "text-primary-500"
                  : "text-typography-500"
              }`}
            >
              {tab.label}
            </Text>
            {tab.id === "unread" && unreadCount > 0 && (
              <View className="bg-background-200 rounded-full px-1.5 py-0.5">
                <Text className="text-xs text-typography-600">
                  {unreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center p-8 gap-3">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="text-sm text-typography-500">読み込み中...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-error-0 p-4 rounded-xl border border-error-200 gap-2 w-full">
            <Text className="text-base font-semibold text-error-700">
              エラーが発生しました
            </Text>
            <Text className="text-sm text-error-700">{error.message}</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={filteredArticles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ArticleItem
              item={item}
              isRead={isArticleRead(item)}
              showReadIndicator={activeFilter === "all"}
              onPress={() => handlePress(item)}
            />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-background-200 ml-[92px]" />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-base text-typography-400">
                {activeFilter === "unread"
                  ? "未読記事はありません"
                  : "記事がありません"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
