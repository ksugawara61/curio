// Mock for react-native-safe-area-context in Storybook (Vite/browser context).
// Returns zero insets since there is no native safe area in a browser.
import type { FC, PropsWithChildren } from "react";

const PassThrough: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export const SafeAreaProvider = PassThrough;
export const SafeAreaView = PassThrough;

export const useSafeAreaInsets = () => ({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const useSafeAreaFrame = () => ({
  x: 0,
  y: 0,
  width: 375,
  height: 812,
});

export const initialWindowMetrics = {
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  frame: { x: 0, y: 0, width: 375, height: 812 },
};
