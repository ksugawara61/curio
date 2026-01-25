import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../../infrastructure/domain/Bookmark";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export const bookmark = async (
  id?: string,
  uri?: string,
): Promise<Bookmark | null> => {
  if (!id && !uri) {
    throw new ServiceError("Either id or uri must be provided", {
      statusCode: 400,
      code: "BAD_REQUEST",
    });
  }

  try {
    const repository = new BookmarkRepository();

    if (id) {
      return await repository.findById(id);
    }

    return await repository.findByUrl(uri as string);
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
