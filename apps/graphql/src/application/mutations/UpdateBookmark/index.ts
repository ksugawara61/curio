import { ServiceError } from "@getcronit/pylon";
import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export type { UpdateBookmarkInput };

export const updateBookmarkUseCase = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  try {
    return await bookmarkRepository.update(id, input);
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
