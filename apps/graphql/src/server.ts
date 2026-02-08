import { articles } from "./application/article/queries/get-articles";
import { createBookmark } from "./application/bookmark/mutations/create-bookmark";
import { deleteBookmark } from "./application/bookmark/mutations/delete-bookmark";
import { updateBookmark } from "./application/bookmark/mutations/update-bookmark";
import { bookmark } from "./application/bookmark/queries/get-bookmark";
import { bookmarks } from "./application/bookmark/queries/get-bookmarks";
import { createTag } from "./application/tag/mutations/create-tag";
import { tags } from "./application/tag/queries/get-tags";
import { withAuth } from "./infrastructure/middleware/auth";

export const server = {
  Query: {
    articles: withAuth(articles),
    bookmarks: withAuth(bookmarks),
    bookmark: withAuth(bookmark),
    tags: withAuth(tags),
  },
  Mutation: {
    createBookmark: withAuth(createBookmark),
    updateBookmark: withAuth(updateBookmark),
    deleteBookmark: withAuth(deleteBookmark),
    createTag: withAuth(createTag),
  },
};
