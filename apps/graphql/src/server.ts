import { fetchArticlesUseCase } from "./application/queries/FetchArticles";
import { fetchBookmarkByIdUseCase } from "./application/queries/FetchBookmarkById";
import { fetchBookmarksUseCase } from "./application/queries/FetchBookmarks";
import { fetchTagsUseCase } from "./application/queries/FetchTags";
import { createBookmarkUseCase } from "./application/mutations/CreateBookmark";
import { deleteBookmarkUseCase } from "./application/mutations/DeleteBookmark";
import { updateBookmarkUseCase } from "./application/mutations/UpdateBookmark";
import { createTagUseCase } from "./application/mutations/CreateTag";
import { withAuth } from "./middleware/auth";

export const server = {
  Query: {
    articles: withAuth(fetchArticlesUseCase),
    bookmarks: withAuth(fetchBookmarksUseCase),
    bookmark: withAuth(fetchBookmarkByIdUseCase),
    tags: withAuth(fetchTagsUseCase),
  },
  Mutation: {
    createBookmark: withAuth(createBookmarkUseCase),
    updateBookmark: withAuth(updateBookmarkUseCase),
    deleteBookmark: withAuth(deleteBookmarkUseCase),
    createTag: withAuth(createTagUseCase),
  },
};
