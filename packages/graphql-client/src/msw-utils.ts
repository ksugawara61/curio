import type { TadaDocumentNode } from "gql.tada";
import {
  type GraphQLQuery,
  type GraphQLResponseResolver,
  type GraphQLVariables,
  graphql,
  type RequestHandlerOptions,
} from "msw";

/**
 * TadaDocumentNodeからGraphQL操作名を抽出
 */
const getOperationName = <
  TResult extends GraphQLQuery = GraphQLQuery,
  TVariables extends GraphQLVariables = GraphQLVariables,
>(
  document: TadaDocumentNode<TResult, TVariables>,
): string => {
  const definition = document.definitions?.[0];
  if (definition?.kind === "OperationDefinition" && definition.name?.value) {
    return definition.name.value;
  }
  throw new Error("Unable to extract operation name from document");
};

/**
 * GraphQLクエリ用のMSWハンドラーを作成
 */
export const createMockQuery = <
  TResult extends GraphQLQuery = GraphQLQuery,
  TVariables extends GraphQLVariables = GraphQLVariables,
>(
  document: TadaDocumentNode<TResult, TVariables>,
  resolver: GraphQLResponseResolver<TResult, TVariables>,
  options?: RequestHandlerOptions,
) => {
  const operationName = getOperationName(document);
  return graphql.query<TResult, TVariables>(operationName, resolver, options);
};

/**
 * GraphQLミューテーション用のMSWハンドラーを作成
 */
export const createMockMutation = <
  TResult extends GraphQLQuery = GraphQLQuery,
  TVariables extends GraphQLVariables = GraphQLVariables,
>(
  document: TadaDocumentNode<TResult, TVariables>,
  resolver: GraphQLResponseResolver<TResult, TVariables>,
  options?: RequestHandlerOptions,
) => {
  const operationName = getOperationName(document);
  return graphql.mutation<TResult, TVariables>(
    operationName,
    resolver,
    options,
  );
};
