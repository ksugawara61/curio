import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export type { CreateBookmarkInput };

export class CreateBookmark
  implements BaseApplication<CreateBookmarkInput, Bookmark>
{
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke(input: CreateBookmarkInput): Promise<Bookmark> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      throw new ServiceError(
        `Failed to create bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const createBookmark = async (
  input: CreateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  const { getUserId } = ContextRepository.create();
  const userId = getUserId();
  return await db.transaction(async (tx) => {
    const repository = new BookmarkRepository(userId, tx);
    return new CreateBookmark(repository).invoke(input);
  });
};
