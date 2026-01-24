import { createOpenApiHttp } from "openapi-msw";
import type { paths } from "../../generated/openapi/schema";
import { baseUrl } from "../openapi/client";

export const openApiMockClient = createOpenApiHttp<paths>({ baseUrl });
