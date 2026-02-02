import useSWR, { type BareFetcher, type Key } from "swr";

/**
 * useSWR の suspense モードを使うためのカスタムフック
 * 公式の suspense モードでは data の型が undefined になってしまうが、
 * 想定していない挙動のため、型を保証するためにこのカスタムフックを作成
 */
export const useSWRSuspense = <T>(key: Key, fetcher: BareFetcher<T> | null) => {
  const res = useSWR<T>(key, fetcher, { suspense: true });

  if (typeof res.data === "undefined") {
    // ここに来ることはない想定
    throw Error("data is undefined");
  }

  return { ...res, data: res.data };
};
