/**
 * Hello Query UseCase
 * Application層：resolverに対応するビジネスロジックを実装
 */

// Input type (引数がないクエリのため空オブジェクト)
export type HelloUseCaseInput = Record<string, never>;

// Output type
export type HelloUseCaseOutput = {
  message: string;
};

/**
 * Hello クエリのユースケース
 * @param _input - 入力パラメータ（このクエリでは使用しない）
 * @returns Hello メッセージ
 */
export const helloUseCase = (
  _input: HelloUseCaseInput
): HelloUseCaseOutput => {
  return {
    message: "world",
  };
};
