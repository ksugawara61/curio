import { ServiceError } from "@getcronit/pylon";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";

export const unarchiveBookmark = async (id: string): Promise<Bookmark> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  try {
    return await db.transaction(async (tx) => {
      const repository = new BookmarkRepository(userId, tx);
      return await repository.unarchive(id);
    });
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
      `Failed to unarchive bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
