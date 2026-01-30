import { createGraphQLClient } from "@curio/graphql-client";
import { getAuthToken } from "./auth-token";

export const apolloClient = createGraphQLClient({
  uri: "http://localhost:3000/graphql",
  getHeaders: async (): Promise<Record<string, string>> => {
    const token = await getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  },
});
