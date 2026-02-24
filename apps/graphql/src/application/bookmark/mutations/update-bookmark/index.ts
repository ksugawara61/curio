import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import type {
  Bookmark,
  UpdateBookmarkInput,
} from "../../../../domain/bookmark/model";
import { BookmarkRepository } from "../../../../domain/bookmark/repository.persistence";
import { createDb } from "../../../../libs/drizzle/client";
import { ContextRepository } from "../../../../shared/context";
import type { BaseApplication } from "../../../base";

export type { UpdateBookmarkInput };

type UpdateBookmarkParams = { id: string; input: UpdateBookmarkInput };

export class UpdateBookmark
  implements BaseApplication<UpdateBookmarkParams, Bookmark>
{
  constructor(private readonly repository: IBookmarkRepository) {}

  async invoke({ id, input }: UpdateBookmarkParams): Promise<Bookmark> {
    try {
      return await this.repository.update(id, input);
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
        `Failed to update bookmark: ${error instanceof Error ? error.message : "Unknown error"}`,
        {
          statusCode: 500,
          code: "INTERNAL_ERROR",
        },
      );
    }
  }
}

export const updateBookmark = async (
  id: string,
  input: UpdateBookmarkInput,
): Promise<Bookmark> => {
  const db = createDb();
  return await db.transaction(async (tx) => {
    const repository = new BookmarkRepository(ContextRepository.create(), tx);
    return new UpdateBookmark(repository).invoke({ id, input });
  });
};
