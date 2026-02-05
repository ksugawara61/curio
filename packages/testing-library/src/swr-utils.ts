import type { Middleware } from "swr";

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

/**
 * SWR ハンドラーからミドルウェアを作成
 * Storybook と Vitest の両方で使用可能
 * suspense モードでも正しく動作する
 *
 * @example
 * ```ts
 * const middleware = createSWRMockMiddleware([
 *   createSWRHandler("blockedDomains", ["example.com"]),
 * ]);
 * ```
 */
export const createSWRMockMiddleware = (
  handlers?: SWRHandler[],
): Middleware[] => {
  if (!handlers || handlers.length === 0) {
    return [];
  }

  return handlers.map<Middleware>((handler) => {
    return (useSWRNext) => {
      return (k, fetcher, config) => {
        if (k === handler.key) {
          return {
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            data: handler.data as any,
            error: undefined,
            isValidating: false,
            isLoading: false,
            // biome-ignore lint/suspicious/noExplicitAny: 汎用的な型としてanyを使用
            mutate: () => Promise.resolve(handler.data as any),
          };
        }
        return useSWRNext(k, fetcher, config);
      };
    };
  });
};
