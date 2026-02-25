import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class DeleteBookmark implements BaseApplication<string, boolean> {
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke(id: string): Promise<boolean> {
    try {
      await this.repository.deleteBookmark(id);
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
  }
}

export const deleteBookmark = async (id: string): Promise<boolean> => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    const repository = new BookmarkRepository(ContextRepository.create(), tx);
    return new DeleteBookmark(repository).invoke(id);
  });
};
