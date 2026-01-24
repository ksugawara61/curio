import { createBookmark } from "./application/mutations/createBookmark";
import { createTag } from "./application/mutations/createTag";
import { deleteBookmark } from "./application/mutations/deleteBookmark";
import { updateBookmark } from "./application/mutations/updateBookmark";
import { articles } from "./application/queries/articles";
import { bookmark } from "./application/queries/bookmark";
import { bookmarks } from "./application/queries/bookmarks";
import { tags } from "./application/queries/tags";
import { withAuth } from "./middleware/auth";

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
