import { fetchArticlesUseCase } from "./application/queries/articles/FetchArticlesUseCase";
import { fetchBookmarkByIdUseCase } from "./application/queries/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/queries/bookmarks/FetchBookmarksUseCase";
import { fetchTagsUseCase } from "./application/queries/tags/FetchTagsUseCase";
import { createBookmarkUseCase } from "./application/mutations/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/mutations/bookmarks/DeleteBookmarkUseCase";
import { updateBookmarkUseCase } from "./application/mutations/bookmarks/UpdateBookmarkUseCase";
import { createTagUseCase } from "./application/mutations/tags/CreateTagUseCase";
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
