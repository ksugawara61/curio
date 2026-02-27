// expo-router のモック（Storybook 用）
// React Navigation のネイティブモジュールへの依存を回避する

import type { FC, ReactNode } from "react";

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
});

export const useLocalSearchParams = () => ({});

export const Link: FC<{ children: ReactNode; href: string }> = ({
  children,
}) => <>{children}</>;
