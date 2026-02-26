import { markArticleAsRead } from "./application/article/mutations/mark-article-as-read";
import { articles } from "./application/article/queries/get-articles";
import { archiveBookmark } from "./application/bookmark/mutations/archive-bookmark";
import { createBookmark } from "./application/bookmark/mutations/create-bookmark";
import { deleteBookmark } from "./application/bookmark/mutations/delete-bookmark";
import { unarchiveBookmark } from "./application/bookmark/mutations/unarchive-bookmark";
import { updateBookmark } from "./application/bookmark/mutations/update-bookmark";
import { archivedBookmarks } from "./application/bookmark/queries/get-archived-bookmarks";
import { bookmark } from "./application/bookmark/queries/get-bookmark";
import { bookmarks } from "./application/bookmark/queries/get-bookmarks";
import { createRssFeed } from "./application/rss-feed/mutations/create-rss-feed";
import { deleteRssFeed } from "./application/rss-feed/mutations/delete-rss-feed";
import { rssFeeds } from "./application/rss-feed/queries/get-rss-feeds";
import { createTag } from "./application/tag/mutations/create-tag";
import { tags } from "./application/tag/queries/get-tags";
import { fetchUrlMetadata } from "./application/url-metadata/queries/fetch-url-metadata";
import { withAuth } from "./middleware/auth";

export const server = {
  Query: {
    articles: withAuth(articles),
    bookmarks: withAuth(bookmarks),
    archivedBookmarks: withAuth(archivedBookmarks),
    bookmark: withAuth(bookmark),
    tags: withAuth(tags),
    rssFeeds: withAuth(rssFeeds),
    fetchUrlMetadata: withAuth(fetchUrlMetadata),
  },
  Mutation: {
    markArticleAsRead: withAuth(markArticleAsRead),
    createBookmark: withAuth(createBookmark),
    updateBookmark: withAuth(updateBookmark),
    archiveBookmark: withAuth(archiveBookmark),
    unarchiveBookmark: withAuth(unarchiveBookmark),
    deleteBookmark: withAuth(deleteBookmark),
    createTag: withAuth(createTag),
    createRssFeed: withAuth(createRssFeed),
    deleteRssFeed: withAuth(deleteRssFeed),
  },
};
