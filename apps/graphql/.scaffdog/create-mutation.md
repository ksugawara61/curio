---
name: 'create-mutation'
root: 'src/application'
output: 'mutations/{{ inputs.name | camel }}'
questions:
  name: 'Please enter mutation name (e.g., createBookmark, createTag)'
  domain: 'Please enter domain type name (e.g., Bookmark, Tag)'
  inputType: 'Please enter input type name (e.g., CreateBookmarkInput, CreateTagInput)'
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
  input: {{ inputs.inputType | pascal }},
): Promise<{{ inputs.domain | pascal }}> => {
  const db = createDb();
  try {
    return await db.transaction(async (tx) => {
      const repository = new {{ inputs.repository | pascal }}(tx);
      return await repository.create(input);
    });
  } catch (error) {
    throw new ServiceError(
      `Failed to create {{ inputs.domain | camel }}: ${error instanceof Error ? error.message : "Unknown error"}`,
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
    it("{{ inputs.domain | camel }}を作成できる", async () => {
      const input: {{ inputs.inputType | pascal }} = {
        // TODO: Add required input fields
      };

      const result = await {{ inputs.name | camel }}(input);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe("異常系", () => {
    // Add error test cases as needed
  });
});
```
