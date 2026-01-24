---
name: 'update-mutation'
root: 'src/application'
output: 'mutations/{{ inputs.name | camel }}'
questions:
  name: 'Please enter mutation name (e.g., updateBookmark, updateTag)'
  domain: 'Please enter domain type name (e.g., Bookmark, Tag)'
  inputType: 'Please enter input type name (e.g., UpdateBookmarkInput, UpdateTagInput)'
  repository: 'Please enter repository name (e.g., BookmarkRepository, TagRepository)'
---

# `{{ inputs.name | camel }}/index.ts`

```typescript
import { ServiceError } from "@getcronit/pylon";
import type {
  {{ inputs.domain | pascal }},
  {{ inputs.inputType | pascal }},
} from "../../../infrastructure/domain/{{ inputs.domain | pascal }}";
import { {{ inputs.repository | pascal }} } from "../../../infrastructure/persistence/{{ inputs.domain | camel }}s";
import { createDb } from "../../../libs/drizzle/client";

export type { {{ inputs.inputType | pascal }} };

export const {{ inputs.name | camel }} = async (
  id: string,
  input: {{ inputs.inputType | pascal }},
): Promise<{{ inputs.domain | pascal }}> => {
  const db = createDb();
  try {
    return await db.transaction(async (tx) => {
      const repository = new {{ inputs.repository | pascal }}(tx);
      return await repository.update(id, input);
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No record was found")
    ) {
      throw new ServiceError("{{ inputs.domain | pascal }} not found", {
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }
    throw new ServiceError(
      `Failed to update {{ inputs.domain | camel }}: ${error instanceof Error ? error.message : "Unknown error"}`,
      {
        statusCode: 500,
        code: "INTERNAL_ERROR",
      },
    );
  }
};
```

# `{{ inputs.name | camel }}/test.ts`

```typescript
import { describe, expect, it } from "vitest";
import { {{ inputs.name | camel }} } from "./index";
import type { {{ inputs.inputType | pascal }} } from "./index";

describe("{{ inputs.name | camel }}", () => {
  describe("正常系", () => {
    it("{{ inputs.domain | camel }}を更新できる", async () => {
      // TODO: Create test data and get actual ID
      const testId = "test-id";
      const input: {{ inputs.inputType | pascal }} = {
        // TODO: Add required input fields
      };

      const result = await {{ inputs.name | camel }}(testId, input);

      expect(result).toBeDefined();
      expect(result.id).toBe(testId);
    });
  });

  describe("異常系", () => {
    it("存在しないIDの場合はNOT_FOUNDエラーを返す", async () => {
      const input: {{ inputs.inputType | pascal }} = {
        // TODO: Add required input fields
      };

      await expect(
        {{ inputs.name | camel }}("non-existent-id", input)
      ).rejects.toThrow("{{ inputs.domain | pascal }} not found");
    });
  });
});
```
