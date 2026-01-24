import createFetch from "openapi-fetch";
import type { paths } from "../../generated/openapi/schema";

export const baseUrl = "https://qiita.com/api/v2";

export const createQiitaApiClient = () =>
  createFetch<paths>({
    baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
