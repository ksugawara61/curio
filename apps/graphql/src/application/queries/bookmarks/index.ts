import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../../infrastructure/domain/Bookmark";
import { ContextRepository } from "../../../infrastructure/internal/context";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export const bookmarks = async (): Promise<Bookmark[]> => {
  try {
    const { getUserId } = ContextRepository.create();
    const userId = getUserId();
    const repository = new BookmarkRepository(userId);
    return await repository.findMany();
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
