/**
 * SWR mock handler type
 * MSW handlers と同様のパターンで SWR モックを定義
 */
export type SWRHandler<T = unknown> = {
  key: string;
  data: T;
};

/**
 * SWR モック用のハンドラーを作成
 *
 * @example
 * ```ts
 * const handler = createSWRHandler("blockedDomains", ["example.com"]);
 * // Use in Storybook parameters:
 * // parameters: { swr: { handlers: [handler] } }
 * ```
 */
export const createSWRHandler = <T>(key: string, data: T): SWRHandler<T> => ({
  key,
  data,
});
