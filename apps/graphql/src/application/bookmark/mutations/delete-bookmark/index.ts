import { ServiceError } from "@getcronit/pylon";
import type { IBookmarkRepository } from "../../../../domain/bookmark/interface";
import { withTransaction } from "../../../../domain/shared/transaction";

const deleteBookmarkUseCase = async (
  id: string,
  { repository }: { repository: IBookmarkRepository },
): Promise<boolean> => {
  try {
    await repository.deleteBookmark(id);
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

export const deleteBookmark = async (id: string): Promise<boolean> => {
  return withTransaction(async ({ bookmark }) =>
    deleteBookmarkUseCase(id, { repository: bookmark }),
  );
};
