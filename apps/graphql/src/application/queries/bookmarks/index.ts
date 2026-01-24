import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../infrastructure/domain/Bookmark";
import * as bookmarkRepository from "../../infrastructure/persistence/BookmarkRepository";

export const bookmarks = async (): Promise<Bookmark[]> => {
  try {
    return await bookmarkRepository.findMany();
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
