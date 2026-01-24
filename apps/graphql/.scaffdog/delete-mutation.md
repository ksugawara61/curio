---
name: 'delete-mutation'
root: 'src/application'
output: 'mutations/{{ inputs.name | camel }}'
questions:
  name: 'Please enter mutation name (e.g., deleteBookmark, deleteTag)'
  domain: 'Please enter domain type name (e.g., Bookmark, Tag)'
  repository: 'Please enter repository name (e.g., BookmarkRepository, TagRepository)'
  deleteMethod: 'Please enter repository delete method name (e.g., deleteBookmark, deleteTag)'
---

# `{{ inputs.name | camel }}/index.ts`

```typescript
import { ServiceError } from "@getcronit/pylon";
import { {{ inputs.repository | pascal }} } from "../../../infrastructure/persistence/{{ inputs.domain | camel }}s";
import { createDb } from "../../../libs/drizzle/client";

export const {{ inputs.name | camel }} = async (id: string): Promise<boolean> => {
  const db = createDb();
  try {
    await db.transaction(async (tx) => {
      const repository = new {{ inputs.repository | pascal }}(tx);
      await repository.{{ inputs.deleteMethod | camel }}(id);
    });
    return true;
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
      `Failed to delete {{ inputs.domain | camel }}: ${error instanceof Error ? error.message : "Unknown error"}`,
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

describe("{{ inputs.name | camel }}", () => {
  describe("正常系", () => {
    it("{{ inputs.domain | camel }}を削除できる", async () => {
      // TODO: Create test data and get actual ID
      const testId = "test-id";

      const result = await {{ inputs.name | camel }}(testId);

      expect(result).toBe(true);
    });
  });

  describe("異常系", () => {
    it("存在しないIDの場合はNOT_FOUNDエラーを返す", async () => {
      await expect(
        {{ inputs.name | camel }}("non-existent-id")
      ).rejects.toThrow("{{ inputs.domain | pascal }} not found");
    });
  });
});
```
