// Mock for react-native-screens in Storybook (Vite/browser context).
// Replaces native screen components with pass-through components.
import type { FC, PropsWithChildren } from "react";

const PassThrough: FC<PropsWithChildren> = ({ children }) => <>{children}</>;
const Noop = () => null;

export const enableScreens = () => {};
export const Screen = PassThrough;
export const ScreenContainer = PassThrough;
export const NativeScreen = PassThrough;
export const NativeScreenContainer = PassThrough;
export const NativeScreenNavigationContainer = PassThrough;
export const ScreenStack = PassThrough;
export const ScreenStackHeaderConfig = Noop;
