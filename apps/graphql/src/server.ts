import { fetchArticlesUseCase } from "./application/articles/FetchArticlesUseCase";
import { createBookmarkUseCase } from "./application/bookmarks/CreateBookmarkUseCase";
import { deleteBookmarkUseCase } from "./application/bookmarks/DeleteBookmarkUseCase";
import { fetchBookmarkByIdUseCase } from "./application/bookmarks/FetchBookmarkByIdUseCase";
import { fetchBookmarksUseCase } from "./application/bookmarks/FetchBookmarksUseCase";
import { updateBookmarkUseCase } from "./application/bookmarks/UpdateBookmarkUseCase";
import { createTagUseCase } from "./application/tags/CreateTagUseCase";
import { fetchTagsUseCase } from "./application/tags/FetchTagsUseCase";
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
