import { useLazyQuery, useMutation, useQuery } from "@curio/graphql-client";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { type FC, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BookmarksQuery } from "./BookmarksQuery";
import { CreateBookmarkMutation } from "./CreateBookmarkMutation";
import { FetchUrlMetadataQuery } from "./FetchUrlMetadataQuery";

export const BookmarkAdd: FC = () => {
  const { url: paramUrl } = useLocalSearchParams<{ url?: string }>();
  const router = useRouter();

  const [url, setUrl] = useState(paramUrl ?? "");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [relatedBookmarkIds, setRelatedBookmarkIds] = useState<string[]>([]);
  const [relatedSearch, setRelatedSearch] = useState("");
  const [titleError, setTitleError] = useState("");

  const [fetchUrlMetadata, { loading: metadataLoading }] = useLazyQuery(
    FetchUrlMetadataQuery,
  );

  const { data: bookmarksData } = useQuery(BookmarksQuery, {
    skip: !showForm,
  });

  const allBookmarks = bookmarksData?.bookmarks ?? [];

  const [createBookmark, { loading: creating }] = useMutation(
    CreateBookmarkMutation,
    {
      onCompleted: () => {
        router.back();
      },
    },
  );

  const handleFetchMetadata = async () => {
    if (!url) return;
    setSubmittedUrl(url);
    const result = await fetchUrlMetadata({ variables: { url } });
    const metadata = result.data?.fetchUrlMetadata;
    setTitle(metadata?.title ?? "");
    setDescription(metadata?.description ?? "");
    setThumbnail(metadata?.thumbnail ?? "");
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

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError("タイトルは必須です");
      return;
    }
    setTitleError("");

    const tagNames = tagInput
      ? tagInput
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      : [];

    createBookmark({
      variables: {
        input: {
          title: title.trim(),
          url: submittedUrl,
          description: description.trim() || undefined,
          note: note.trim() || undefined,
          thumbnail: thumbnail.trim() || undefined,
          tagNames: tagNames.length > 0 ? tagNames : undefined,
          relatedBookmarkIds:
            relatedBookmarkIds.length > 0 ? relatedBookmarkIds : undefined,
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backArrow} />
        </Pressable>
        <Text style={styles.headerTitle}>ブックマークを追加</Text>
        <View style={styles.headerRight} />
      </View>

      {!showForm ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
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
              style={styles.urlInput}
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
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.formContent}>
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
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="タイトルを入力..."
                style={[styles.input, titleError ? styles.inputError : null]}
              />
              {titleError ? (
                <Text className="text-xs text-error-500">{titleError}</Text>
              ) : null}
            </View>

            <View className="gap-1 mb-4">
              <Text className="text-sm font-medium text-typography-700">
                説明（任意）
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="説明を入力..."
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
              />
            </View>

            <View className="gap-1 mb-4">
              <Text className="text-sm font-medium text-typography-700">
                メモ（任意・Markdown対応）
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Markdown形式でメモを入力..."
                multiline
                numberOfLines={6}
                style={[styles.input, styles.textAreaLarge]}
              />
            </View>

            <View className="gap-1 mb-4">
              <Text className="text-sm font-medium text-typography-700">
                サムネイルURL（任意）
              </Text>
              <TextInput
                value={thumbnail}
                onChangeText={setThumbnail}
                placeholder="https://example.com/image.jpg"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                style={styles.input}
              />
            </View>

            <View className="gap-1 mb-4">
              <Text className="text-sm font-medium text-typography-700">
                タグ（カンマ区切り）
              </Text>
              <TextInput
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="例: tech, tutorial, react"
                style={styles.input}
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
                    style={[styles.input, styles.searchInput]}
                  />
                  <View style={styles.relatedList}>
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
              onPress={handleSubmit}
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
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  headerRight: {
    width: 26,
  },
  keyboardView: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 32,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    color: "#1a1a1a",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  textAreaLarge: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  searchInput: {
    paddingVertical: 8,
  },
  relatedList: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 8,
    maxHeight: 200,
  },
  urlInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    color: "#1a1a1a",
  },
});
