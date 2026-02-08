import { ServiceError } from "@getcronit/pylon";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";

export const deleteBookmark = async (id: string): Promise<boolean> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  try {
    await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(userId, tx);
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
