export type BaseApplication<TInput, TOutput> = {
  invoke(input: TInput): Promise<TOutput>;
};
