// Mock for react-native-gesture-handler in Storybook (Vite/browser context).
// Replaces native gesture recognizers with pass-through components.
import type { FC, PropsWithChildren } from "react";

const PassThrough: FC<PropsWithChildren> = ({ children }) => <>{children}</>;

export const GestureHandlerRootView = PassThrough;
export const GestureDetector = PassThrough;
export const PanGestureHandler = PassThrough;
export const TapGestureHandler = PassThrough;
export const ScrollView = PassThrough;
export const FlatList = PassThrough;

export const Gesture = {
  Tap: () => ({ onEnd: () => ({}), onBegin: () => ({}) }),
  Pan: () => ({ onUpdate: () => ({}), onEnd: () => ({}) }),
  Simultaneous: () => ({}),
  Exclusive: () => ({}),
};
