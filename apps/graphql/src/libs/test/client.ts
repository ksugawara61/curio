import { createOpenApiHttp } from "openapi-msw";
import { baseUrl } from "../../shared/openapi/client";
import type { paths } from "../../shared/openapi/generated/schema";

export const openApiMockClient = createOpenApiHttp<paths>({ baseUrl });
