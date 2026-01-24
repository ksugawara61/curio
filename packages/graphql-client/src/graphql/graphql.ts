import { initGraphQLTada } from "gql.tada";
import type { introspection } from "./graphql-env";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    Date: string;
    DateTime: string;
    Time: string;
    DateTimeISO: string;
    Float: number;
    Number: number;
    String: string;
    Boolean: boolean;
    ID: string;
    Void: undefined;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
