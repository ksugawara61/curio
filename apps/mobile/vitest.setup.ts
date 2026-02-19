import "@testing-library/jest-dom";
import type { ReactNode } from "react";
import { vi } from "vitest";

// react-native-reanimated: uses native Animated API, not compatible with jsdom
vi.mock("react-native-reanimated", () => ({
  default: {
    createAnimatedComponent: (Component: unknown) => Component,
  },
  useSharedValue: vi.fn((value: unknown) => ({ value })),
  useAnimatedStyle: vi.fn(() => ({})),
  withTiming: vi.fn((value: unknown) => value),
  withSpring: vi.fn((value: unknown) => value),
  withDelay: vi.fn((_delay: number, animation: unknown) => animation),
  withSequence: vi.fn((...animations: unknown[]) => animations[0]),
  withRepeat: vi.fn((animation: unknown) => animation),
  Easing: { bezier: vi.fn(() => vi.fn()), linear: vi.fn(), inOut: vi.fn() },
  cancelAnimation: vi.fn(),
  runOnJS: vi.fn((fn: unknown) => fn),
  makeMutable: vi.fn((value: unknown) => ({ value })),
  FadeIn: { duration: vi.fn() },
  FadeOut: { duration: vi.fn() },
}));

// react-native-gesture-handler: uses native touch events, not compatible with jsdom
vi.mock("react-native-gesture-handler", () => ({
  GestureHandlerRootView: ({ children }: { children: ReactNode }) => children,
  Gesture: {
    Tap: vi.fn(() => ({
      onEnd: vi.fn(() => ({})),
      onBegin: vi.fn(() => ({})),
    })),
    Pan: vi.fn(() => ({
      onUpdate: vi.fn(() => ({})),
      onEnd: vi.fn(() => ({})),
    })),
    Simultaneous: vi.fn(),
    Exclusive: vi.fn(),
  },
  GestureDetector: ({ children }: { children: ReactNode }) => children,
  PanGestureHandler: ({ children }: { children: ReactNode }) => children,
  TapGestureHandler: ({ children }: { children: ReactNode }) => children,
  ScrollView: ({ children }: { children: ReactNode }) => children,
  FlatList: ({ children }: { children: ReactNode }) => children,
}));

// react-native-safe-area-context: uses native safe area insets
vi.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
  SafeAreaView: ({ children }: { children: ReactNode }) => children,
  useSafeAreaInsets: vi.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  useSafeAreaFrame: vi.fn(() => ({ x: 0, y: 0, width: 375, height: 812 })),
  initialWindowMetrics: {
    insets: { top: 0, bottom: 0, left: 0, right: 0 },
    frame: { x: 0, y: 0, width: 375, height: 812 },
  },
}));

// react-native-screens: uses native screen components
vi.mock("react-native-screens", () => ({
  enableScreens: vi.fn(),
  Screen: ({ children }: { children: ReactNode }) => children,
  ScreenContainer: ({ children }: { children: ReactNode }) => children,
  NativeScreen: ({ children }: { children: ReactNode }) => children,
  NativeScreenContainer: ({ children }: { children: ReactNode }) => children,
  NativeScreenNavigationContainer: ({ children }: { children: ReactNode }) =>
    children,
  ScreenStack: ({ children }: { children: ReactNode }) => children,
  ScreenStackHeaderConfig: () => null,
}));

// expo-router: file-based router that relies on native navigation
vi.mock("expo-router", () => ({
  Stack: ({ children }: { children: ReactNode }) => children,
  Tabs: ({ children }: { children: ReactNode }) => children,
  Link: ({ children }: { children: ReactNode; href: string }) => children,
  Redirect: () => null,
  Slot: ({ children }: { children: ReactNode }) => children,
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    navigate: vi.fn(),
    canGoBack: vi.fn(() => false),
    dismiss: vi.fn(),
  })),
  useLocalSearchParams: vi.fn(() => ({})),
  useGlobalSearchParams: vi.fn(() => ({})),
  usePathname: vi.fn(() => "/"),
  useSegments: vi.fn(() => []),
  useNavigation: vi.fn(() => ({ navigate: vi.fn(), goBack: vi.fn() })),
}));

// expo-status-bar: uses native status bar
vi.mock("expo-status-bar", () => ({
  StatusBar: () => null,
  setStatusBarStyle: vi.fn(),
  setStatusBarHidden: vi.fn(),
}));
