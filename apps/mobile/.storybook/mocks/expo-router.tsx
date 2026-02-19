// Mock for expo-router in Storybook (Vite/browser context).
// Stories test individual screens in isolation, so navigation is a no-op.
import type { FC, PropsWithChildren } from "react";

const PassThrough: FC<PropsWithChildren> = ({ children }) => <>{children}</>;
const Noop = () => null;

export const Stack = PassThrough;
export const Tabs = PassThrough;
export const Slot = PassThrough;
export const Link = PassThrough;
export const Redirect = Noop;

export const useRouter = () => ({
  push: () => {},
  replace: () => {},
  back: () => {},
  navigate: () => {},
  canGoBack: () => false,
  dismiss: () => {},
});

export const useLocalSearchParams = () => ({});
export const useGlobalSearchParams = () => ({});
export const usePathname = () => "/";
export const useSegments = () => [];
export const useNavigation = () => ({ navigate: () => {}, goBack: () => {} });
