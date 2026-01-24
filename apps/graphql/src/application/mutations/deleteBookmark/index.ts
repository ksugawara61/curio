import { ServiceError } from "@getcronit/pylon";
import { createDb } from "../../../libs/drizzle/client";
import { BookmarkRepository } from "../../../infrastructure/persistence/bookmarks";

export const deleteBookmark = async (id: string): Promise<boolean> => {
  const db = createDb();
  try {
    await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(tx);
      await repository.deleteBookmark(id);
    });
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
