---
name: 'single-query'
root: 'src/application'
output: 'queries/{{ inputs.name | camel }}'
questions:
  name: 'Please enter query name (e.g., bookmark, article)'
  domain: 'Please enter domain type name (e.g., Bookmark, Article)'
  repository: 'Please enter repository name (e.g., BookmarkRepository, ArticleRepository)'
---

# `{{ inputs.name | camel }}/index.ts`

```typescript
import { ServiceError } from "@getcronit/pylon";
import type { {{ inputs.domain | pascal }} } from "../../../infrastructure/domain/{{ inputs.domain | pascal }}";
import { {{ inputs.repository | pascal }} } from "../../../infrastructure/persistence/{{ inputs.name | camel }}s";

export const {{ inputs.name | camel }} = async (id: string): Promise<{{ inputs.domain | pascal }} | null> => {
  try {
    const repository = new {{ inputs.repository | pascal }}();
    return await repository.findById(id);
  } catch (error) {
    throw new ServiceError(
      `Failed to fetch {{ inputs.name | camel }}: ${error instanceof Error ? error.message : "Unknown error"}`,
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
    it("指定されたIDの{{ inputs.name | camel }}を取得できる", async () => {
      // TODO: Create test data and get actual ID
      const testId = "test-id";
      const result = await {{ inputs.name | camel }}(testId);

      expect(result).toBeDefined();
    });

    it("存在しないIDの場合はnullを返す", async () => {
      const result = await {{ inputs.name | camel }}("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("異常系", () => {
    // Add error test cases as needed
  });
});
```
