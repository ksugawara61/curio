import { useQuery } from "@curio/graphql-client";
import { useRouter } from "expo-router";
import type { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { RecentArticlesQuery } from "./RecentArticlesQuery";

type Article = {
  id: string;
  title: string;
  description: string | null | undefined;
  url: string;
  thumbnail_url: string | null | undefined;
  pub_date: string | null | undefined;
};

const ArticleItem: FC<{ item: Article }> = ({ item }) => {
  const router = useRouter();
  const handlePress = () => {
    if (Platform.OS === "web") {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    router.push({
      pathname: "/article-webview",
      params: { url: item.url, title: item.title },
    });
  };

  return (
    <Pressable
      className="flex-row bg-background-0 px-4 py-3 gap-3 active:opacity-70"
      onPress={handlePress}
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
        <Text
          className="text-[15px] font-semibold text-typography-900 leading-5"
          numberOfLines={2}
        >
          {item.title}
        </Text>
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

  const articles = (data?.articles ?? []) as Article[];

  return (
    <View className="flex-1 bg-background-50">
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
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ArticleItem item={item} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-background-200 ml-[92px]" />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-base text-typography-400">
                記事がありません
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
