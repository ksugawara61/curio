import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../shared/context";

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
