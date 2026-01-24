import { ServiceError } from "@getcronit/pylon";
import { createDb } from "../../../libs/drizzle/client";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../infrastructure/domain/Bookmark";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export type { CreateBookmarkInput };

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  try {
    return await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(tx);
      return await repository.create(input);
    });
  } catch (error) {
    throw new ServiceError(
      `Failed to create bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
