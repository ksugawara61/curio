import { ServiceError } from "@getcronit/pylon";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const deleteBookmarkUseCase = async (id: string): Promise<boolean> => {
  try {
    await bookmarkRepository.deleteBookmark(id);
    return true;
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
      `Failed to delete bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
