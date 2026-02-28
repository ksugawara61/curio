import { useQuery } from "@curio/graphql-client";
import { useRouter } from "expo-router";
import type { FC } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { BookmarksQuery } from "./BookmarksQuery";

type Tag = {
  id: string;
  name: string;
};

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string | null | undefined;
  thumbnail: string | null | undefined;
  tags: Tag[] | null | undefined;
  created_at: string;
};

const BookmarkItem: FC<{ item: Bookmark }> = ({ item }) => {
  const router = useRouter();
  return (
    <Pressable
      className="flex-row bg-background-0 px-4 py-3 gap-3 active:opacity-70"
      onPress={() =>
        router.push({
          pathname: "/article-webview",
          params: { url: item.url, title: item.title },
        })
      }
    >
      {item.thumbnail ? (
        <Image
          source={{ uri: item.thumbnail }}
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
        {item.tags && item.tags.length > 0 ? (
          <View className="flex-row flex-wrap gap-1 mt-0.5">
            {item.tags.map((tag) => (
              <View
                key={tag.id}
                className="bg-background-100 rounded px-1.5 py-0.5"
              >
                <Text className="text-xs text-typography-600">{tag.name}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Text className="text-xs text-typography-400 mt-0.5">
          {new Date(item.created_at).toLocaleDateString("ja-JP")}
        </Text>
      </View>
    </Pressable>
  );
};

export const BookmarkList: FC = () => {
  const { data, error, loading } = useQuery(BookmarksQuery);

  const bookmarks = (data?.bookmarks ?? []) as Bookmark[];

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
          data={bookmarks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <BookmarkItem item={item} />}
          contentContainerStyle={{ paddingVertical: 8 }}
          ItemSeparatorComponent={() => (
            <View className="h-px bg-background-200 ml-[92px]" />
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center p-8">
              <Text className="text-base text-typography-400">
                ブックマークがありません
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
