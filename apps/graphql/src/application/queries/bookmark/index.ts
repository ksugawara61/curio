import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../../infrastructure/domain/Bookmark";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export const bookmark = async (id: string): Promise<Bookmark | null> => {
  try {
    const repository = new BookmarkRepository();
    return await repository.findById(id);
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
