// react-native-safe-area-context のモック（Storybook 用）
// ネイティブのセーフエリア取得処理をブラウザ向けに差し替える

import type { FC, ReactNode } from "react";
import { View } from "react-native";

type ViewProps = {
  children?: ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: react-native の StyleSheet 型を受け入れる
  style?: any;
};

export const SafeAreaView: FC<ViewProps> = ({ children, style }) => (
  <View style={style}>{children}</View>
);

export const SafeAreaProvider: FC<ViewProps> = ({ children }) => (
  <>{children}</>
);

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});
