import { ServiceError } from "@getcronit/pylon";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../../infrastructure/persistence/BookmarkRepository";

export type { CreateBookmarkInput };

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  try {
    return await bookmarkRepository.create(input);
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
