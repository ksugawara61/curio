import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { DeleteBookmarkMutation } from "./DeleteBookmarkMutation";

export const DeleteBookmarkMutationMocks = {
  Loading: createMockMutation(DeleteBookmarkMutation, mockLoadingResolver),
  Success: createMockMutation(DeleteBookmarkMutation, () => {
    return HttpResponse.json({
      data: { deleteBookmark: true },
    });
  }),
  Error: createMockMutation(DeleteBookmarkMutation, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to delete bookmark" }],
    });
  }),
};
