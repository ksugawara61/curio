import { ServiceError } from "@getcronit/pylon";
import { createDb } from "../../../libs/drizzle/client";
import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../../infrastructure/domain/Bookmark";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export type { UpdateBookmarkInput };

export const updateBookmark = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  try {
    return await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(tx);
      return await repository.update(id, input);
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No record was found")
    ) {
      throw new ServiceError("Bookmark not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
    throw new ServiceError(
      `Failed to update bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
