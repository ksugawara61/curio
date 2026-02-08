import { ServiceError } from "@getcronit/pylon";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../libs/drizzle/client";
import { ContextRepository } from "../../../shared/context";

export type { CreateBookmarkInput };

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  try {
    return await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(userId, tx);
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
