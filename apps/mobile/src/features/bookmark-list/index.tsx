import { useMutation, useSuspenseQuery } from "@curio/graphql-client";
import { type FC, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArchiveBookmarkMutation } from "./archive-bookmark-mutation";
import { ArchivedBookmarksQuery } from "./archived-bookmarks-query";
import { BookmarksQuery } from "./bookmarks-query";
import { DeleteBookmarkMutation } from "./delete-bookmark-mutation";
import { UnarchiveBookmarkMutation } from "./unarchive-bookmark-mutation";

type ViewMode = "active" | "archived";

export const BookmarkList: FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const { data, refetch } = useSuspenseQuery(BookmarksQuery);
  const { data: archivedData, refetch: refetchArchived } = useSuspenseQuery(
    ArchivedBookmarksQuery,
  );
  const [deleteBookmark, { loading: deleting }] = useMutation(
    DeleteBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [archiveBookmark, { loading: archiving }] = useMutation(
    ArchiveBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [unarchiveBookmark, { loading: unarchiving }] = useMutation(
    UnarchiveBookmarkMutation,
    {
      onCompleted: () => {
        refetch();
        refetchArchived();
      },
    },
  );
  const [searchQuery, setSearchQuery] = useState("");

  const currentBookmarks =
    viewMode === "active" ? data?.bookmarks : archivedData?.archivedBookmarks;

  const filteredBookmarks = useMemo(() => {
    if (!currentBookmarks) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return currentBookmarks;

    return currentBookmarks.filter((bookmark) => {
      const titleMatch = bookmark.title?.toLowerCase().includes(query);
      const descMatch = bookmark.description?.toLowerCase().includes(query);
      const noteMatch = bookmark.note?.toLowerCase().includes(query);
      const tagMatch = bookmark.tags?.some((tag) =>
        tag.name.toLowerCase().includes(query),
      );
      return titleMatch || descMatch || noteMatch || tagMatch;
    });
  }, [currentBookmarks, searchQuery]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert("Delete Bookmark", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteBookmark({ variables: { id } }),
      },
    ]);
  };

  const handleArchive = (id: string) => {
    archiveBookmark({ variables: { id } });
  };

  const handleUnarchive = (id: string) => {
    unarchiveBookmark({ variables: { id } });
  };

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url);
  };

  const mutating = deleting || archiving || unarchiving;

  const activeCount = data?.bookmarks?.length ?? 0;
  const archivedCount = archivedData?.archivedBookmarks?.length ?? 0;

  if (activeCount === 0 && archivedCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>&#128278;</Text>
        <Text style={styles.emptyText}>No bookmarks yet</Text>
        <Text style={styles.emptySubtext}>
          Add bookmarks from the browser extension
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {viewMode === "active" ? activeCount : archivedCount}
          </Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, viewMode === "active" && styles.tabActive]}
          onPress={() => setViewMode("active")}
        >
          <Text
            style={[
              styles.tabText,
              viewMode === "active" && styles.tabTextActive,
            ]}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, viewMode === "archived" && styles.tabActive]}
          onPress={() => setViewMode("archived")}
        >
          <Text
            style={[
              styles.tabText,
              viewMode === "archived" && styles.tabTextActive,
            ]}
          >
            Archived
            {archivedCount > 0 ? ` (${archivedCount})` : ""}
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by title, description, note, or tag..."
        placeholderTextColor="#9ca3af"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredBookmarks.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>
            {searchQuery.trim()
              ? `No bookmarks matching "${searchQuery.trim()}"`
              : viewMode === "active"
                ? "No active bookmarks"
                : "No archived bookmarks"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBookmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: bookmark }) => (
            <View style={styles.card}>
              <Pressable onPress={() => handleOpenUrl(bookmark.url)}>
                <Text style={styles.cardTitle}>{bookmark.title}</Text>
              </Pressable>

              {bookmark.thumbnail ? (
                <Image
                  source={{ uri: bookmark.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              ) : null}

              <Text style={styles.url} numberOfLines={1}>
                {bookmark.url}
              </Text>

              {bookmark.description ? (
                <Text style={styles.description} numberOfLines={2}>
                  {bookmark.description}
                </Text>
              ) : null}

              {bookmark.note ? (
                <Text style={styles.note} numberOfLines={3}>
                  {bookmark.note}
                </Text>
              ) : null}

              {bookmark.tags && bookmark.tags.length > 0 ? (
                <View style={styles.tagContainer}>
                  {bookmark.tags.map((tag) => (
                    <View key={tag.id} style={styles.tag}>
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.cardFooter}>
                <Text style={styles.dateText}>
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </Text>
                <View style={styles.actionButtons}>
                  {viewMode === "active" ? (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleArchive(bookmark.id)}
                      disabled={mutating}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          mutating && styles.disabledText,
                        ]}
                      >
                        Archive
                      </Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => handleUnarchive(bookmark.id)}
                      disabled={mutating}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          mutating && styles.disabledText,
                        ]}
                      >
                        Unarchive
                      </Text>
                    </Pressable>
                  )}
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleDelete(bookmark.id, bookmark.title)}
                    disabled={mutating}
                  >
                    <Text
                      style={[
                        styles.deleteButtonText,
                        mutating && styles.disabledText,
                      ]}
                    >
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#374151",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#111827",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: "#111827",
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
  },
  thumbnail: {
    height: 128,
    width: "100%",
    borderRadius: 8,
  },
  url: {
    fontSize: 12,
    color: "#9ca3af",
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
  },
  note: {
    fontSize: 14,
    color: "#6b7280",
    fontStyle: "italic",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 12,
    color: "#6b7280",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#9ca3af",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 13,
    color: "#6b7280",
  },
  deleteButtonText: {
    fontSize: 13,
    color: "#dc2626",
  },
  disabledText: {
    opacity: 0.4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: "#6b7280",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
  noResults: {
    paddingVertical: 16,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
