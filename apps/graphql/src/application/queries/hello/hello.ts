/**
 * Hello Query
 * Application層：resolverに対応するビジネスロジックを実装
 */

// Input type (引数がないクエリのため空オブジェクト)
export type HelloInput = Record<string, never>;

// Output type
export type HelloOutput = {
  message: string;
};

/**
 * Hello クエリ
 * @param _input - 入力パラメータ（このクエリでは使用しない）
 * @returns Hello メッセージ
 */
export const hello = (_input: HelloInput): HelloOutput => {
  return {
    message: "world",
  };
};
