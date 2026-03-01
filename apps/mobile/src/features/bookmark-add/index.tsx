import { useLazyQuery, useMutation, useQuery } from "@curio/graphql-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarksQuery } from "./BookmarksQuery";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";
import { FetchUrlMetadataQuery } from "./FetchUrlMetadataQuery";
import { type BookmarkFormValues, bookmarkFormSchema } from "./schema";

export const BookmarkAdd: FC = () => {
  const { url: paramUrl } = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();

  const [url, setUrl] = useState(paramUrl ?? "");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [relatedBookmarkIds, setRelatedBookmarkIds] = useState<string[]>([]);
  const [relatedSearch, setRelatedSearch] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkFormSchema),
    defaultValues: {
      title: "",
      description: "",
      note: "",
      thumbnail: "",
      tagInput: "",
    },
  });

  const [fetchUrlMetadata, { loading: metadataLoading }] = useLazyQuery(
    FetchUrlMetadataQuery,
  );

  const { data: bookmarksData } = useQuery(BookmarksQuery, {
    skip: !showForm,
  });

  const allBookmarks = bookmarksData?.bookmarks ?? [];

  const navigateBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        navigateBack();
      },
    },
  );

  const handleFetchMetadata = async () => {
    if (!url) return;
    setSubmittedUrl(url);
    const result = await fetchUrlMetadata({ variables: { url } });
    const metadata = result.data?.fetchUrlMetadata;
    reset({
      title: metadata?.title ?? "",
      description: metadata?.description ?? "",
      note: "",
      thumbnail: metadata?.thumbnail ?? "",
      tagInput: "",
    });
    setShowForm(true);
  };

  const toggleRelated = (id: string) => {
    setRelatedBookmarkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filteredBookmarks = allBookmarks.filter((b) =>
    b.title.toLowerCase().includes(relatedSearch.toLowerCase()),
  );

  const onSubmit = (data: BookmarkFormValues) => {
    const tagNames = data.tagInput
      ? data.tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    createBookmark({
      variables: {
        input: {
          title: data.title,
          url: submittedUrl,
          description: data.description || undefined,
          note: data.note || undefined,
          thumbnail: data.thumbnail || undefined,
          tagNames: tagNames.length > 0 ? tagNames : undefined,
          relatedBookmarkIds:
            relatedBookmarkIds.length > 0 ? relatedBookmarkIds : undefined,
        },
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <View className="h-11 flex-row items-center justify-between px-4 border-b border-background-200">
        <Pressable
          className="p-2 justify-center items-center"
          onPress={() => navigateBack()}
        >
          <View
            className="w-2.5 h-2.5 border-l-2 border-b-2"
            style={{ borderColor: "#0066cc", transform: [{ rotate: "45deg" }] }}
          />
        </Pressable>
        <Text className="text-base font-semibold text-typography-900">
          ブックマークを追加
        </Text>
        <View className="w-[26px]" />
      </View>

      {!showForm ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="p-4 gap-3">
            <Text className="text-base font-semibold text-typography-900">
              URLを入力
            </Text>
            <TextInput
              value={url}
              onChangeText={setUrl}
              placeholder="https://example.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              autoFocus
              className="bg-background-50 rounded-xl p-[14px] text-[15px] border border-background-200 text-typography-900"
            />
            <Pressable
              className={`py-3 rounded-xl items-center ${url && !metadataLoading ? "bg-primary-500 active:opacity-70" : "bg-background-300"}`}
              onPress={handleFetchMetadata}
              disabled={!url || metadataLoading}
            >
              {metadataLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-base font-semibold text-white">次へ</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView>
            <View className="p-4 pb-8">
              <Text
                className="text-xs text-typography-400 mb-4"
                numberOfLines={1}
              >
                {submittedUrl}
              </Text>

              <View className="gap-1 mb-4">
                <Text className="text-sm font-medium text-typography-700">
                  タイトル <Text className="text-error-500">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="タイトルを入力..."
                      className={`bg-background-50 rounded-[10px] p-3 text-[15px] border text-typography-900 ${errors.title ? "border-error-500" : "border-background-200"}`}
                    />
                  )}
                />
                {errors.title ? (
                  <Text className="text-xs text-error-500">
                    {errors.title.message}
                  </Text>
                ) : null}
              </View>

              <View className="gap-1 mb-4">
                <Text className="text-sm font-medium text-typography-700">
                  説明（任意）
                </Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="説明を入力..."
                      multiline
                      numberOfLines={3}
                      className="bg-background-50 rounded-[10px] p-3 text-[15px] border border-background-200 text-typography-900 min-h-[72px]"
                      style={{ textAlignVertical: "top" }}
                    />
                  )}
                />
              </View>

              <View className="gap-1 mb-4">
                <Text className="text-sm font-medium text-typography-700">
                  メモ（任意・Markdown対応）
                </Text>
                <Controller
                  control={control}
                  name="note"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Markdown形式でメモを入力..."
                      multiline
                      numberOfLines={6}
                      className="bg-background-50 rounded-[10px] p-3 text-[15px] border border-background-200 text-typography-900 min-h-[120px]"
                      style={{ textAlignVertical: "top" }}
                    />
                  )}
                />
              </View>

              <View className="gap-1 mb-4">
                <Text className="text-sm font-medium text-typography-700">
                  サムネイルURL（任意）
                </Text>
                <Controller
                  control={control}
                  name="thumbnail"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="https://example.com/image.jpg"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                      className="bg-background-50 rounded-[10px] p-3 text-[15px] border border-background-200 text-typography-900"
                    />
                  )}
                />
              </View>

              <View className="gap-1 mb-4">
                <Text className="text-sm font-medium text-typography-700">
                  タグ（カンマ区切り）
                </Text>
                <Controller
                  control={control}
                  name="tagInput"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="例: tech, tutorial, react"
                      className="bg-background-50 rounded-[10px] p-3 text-[15px] border border-background-200 text-typography-900"
                    />
                  )}
                />
              </View>

              <View className="gap-2 mb-6">
                <Text className="text-sm font-medium text-typography-700">
                  関連ブックマーク（任意）
                </Text>
                {relatedBookmarkIds.length > 0 && (
                  <View className="flex-row flex-wrap gap-1">
                    {allBookmarks
                      .filter((b) => relatedBookmarkIds.includes(b.id))
                      .map((b) => (
                        <Pressable
                          key={b.id}
                          className="flex-row items-center bg-primary-100 rounded-full px-2.5 py-1 gap-1 active:opacity-70"
                          onPress={() => toggleRelated(b.id)}
                        >
                          <Text className="text-xs text-primary-700">
                            {b.title}
                          </Text>
                          <Text className="text-xs text-primary-500">×</Text>
                        </Pressable>
                      ))}
                  </View>
                )}
                {allBookmarks.length === 0 ? (
                  <Text className="text-sm text-typography-400">
                    関連付けるブックマークがありません
                  </Text>
                ) : (
                  <>
                    <TextInput
                      value={relatedSearch}
                      onChangeText={setRelatedSearch}
                      placeholder="ブックマークを検索..."
                      className="bg-background-50 rounded-[10px] py-2 px-3 text-[15px] border border-background-200 text-typography-900"
                    />
                    <View className="border border-background-200 rounded-[10px] p-2 max-h-[200px]">
                      {filteredBookmarks.length === 0 ? (
                        <Text className="text-sm text-typography-400 py-2 text-center">
                          該当するブックマークがありません
                        </Text>
                      ) : (
                        filteredBookmarks.map((b) => (
                          <Pressable
                            key={b.id}
                            className="flex-row items-center gap-2 py-2 px-1 active:opacity-70"
                            onPress={() => toggleRelated(b.id)}
                          >
                            <View
                              className={`w-5 h-5 rounded border-2 items-center justify-center ${
                                relatedBookmarkIds.includes(b.id)
                                  ? "bg-primary-500 border-primary-500"
                                  : "border-background-400"
                              }`}
                            >
                              {relatedBookmarkIds.includes(b.id) && (
                                <Ionicons
                                  name="checkmark"
                                  size={12}
                                  color="#ffffff"
                                />
                              )}
                            </View>
                            <Text
                              className="flex-1 text-sm text-typography-800"
                              numberOfLines={1}
                            >
                              {b.title}
                            </Text>
                          </Pressable>
                        ))
                      )}
                    </View>
                  </>
                )}
              </View>

              <Pressable
                className={`py-3.5 rounded-xl items-center mb-4 ${creating ? "bg-primary-300" : "bg-primary-500 active:opacity-70"}`}
                onPress={handleSubmit(onSubmit)}
                disabled={creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    追加する
                  </Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};
