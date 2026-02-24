import { ServiceError } from "@getcronit/pylon";
import type {
  Bookmark,
  CreateBookmarkInput,
} from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export type { CreateBookmarkInput };

type DbClient = ReturnType<typeof createDb>;

export class CreateBookmark
  implements BaseApplication<CreateBookmarkInput, Bookmark>
{
  constructor(
    private readonly db: DbClient,
    private readonly userId: string,
  ) {}

  async invoke(input: CreateBookmarkInput): Promise<Bookmark> {
    try {
      return await this.db.transaction(async (tx) => {
        const repository = new BookmarkRepository(this.userId, tx);
        return await repository.create(input);
      });
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
  return new CreateBookmark(db, userId).invoke(input);
};
