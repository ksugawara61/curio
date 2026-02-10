import {
  createMockMutation,
  mockLoadingResolver,
} from "@curio/testing-library";
import { HttpResponse } from "msw";
import { DeleteRssFeedMutation } from "./DeleteRssFeedMutation";

export const DeleteRssFeedMutationMocks = {
  Loading: createMockMutation(DeleteRssFeedMutation, mockLoadingResolver),
  Success: createMockMutation(DeleteRssFeedMutation, () => {
    return HttpResponse.json({
      data: { deleteRssFeed: true },
    });
  }),
  Error: createMockMutation(DeleteRssFeedMutation, () => {
    return HttpResponse.json({
      errors: [{ message: "Failed to delete RSS feed" }],
    });
  }),
};
