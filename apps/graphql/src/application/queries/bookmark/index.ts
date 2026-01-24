import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const bookmark = async (
  id: string,
): Promise<Bookmark | null> => {
  try {
    return await bookmarkRepository.findById(id);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
