import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type { Bookmark } from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { ContextRepository } from "../../../../shared/context";
import { DrizzleRepository } from "../../../../shared/drizzle";
import type { BaseApplication } from "../../../base";

export class GetArchivedBookmarks implements BaseApplication<void, Bookmark[]> {
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke(): Promise<Bookmark[]> {
    try {
      return await this.repository.findManyArchived();
    } catch (error) {
      throw new ServiceError(
        `Failed to fetch archived bookmarks: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const archivedBookmarks = async (): Promise<Bookmark[]> => {
  const repository = new BookmarkRepository(
    ContextRepository.create(),
    DrizzleRepository.create().getDb(),
  );
  return new GetArchivedBookmarks(repository).invoke();
};
