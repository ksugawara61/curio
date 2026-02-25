import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export class UnarchiveBookmark implements BaseApplication<string, Bookmark> {
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke(id: string): Promise<Bookmark> {
    try {
      return await this.repository.unarchive(id);
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
  }
}

export const unarchiveBookmark = async (id: string): Promise<Bookmark> => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    const repository = new BookmarkRepository(ContextRepository.create(), tx);
    return new UnarchiveBookmark(repository).invoke(id);
  });
};
