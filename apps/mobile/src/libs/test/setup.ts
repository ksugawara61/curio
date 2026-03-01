import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw/server";

// @clerk/clerk-expo をモック（webextension-polyfill や Native モジュールのエラーを回避）
vi.mock("@clerk/clerk-expo", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  useClerk: () => ({
    signOut: () => Promise.resolve(),
  }),
  useUser: () => ({
    user: {
      id: "test-user",
      emailAddresses: [{ emailAddress: "test@example.com" }],
    },
    isSignedIn: true,
    isLoaded: true,
  }),
  useAuth: () => ({
    getToken: () => Promise.resolve("test-token"),
    isSignedIn: true,
    isLoaded: true,
  }),
}));

// expo-router をモック
vi.mock("expo-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// react-native-safe-area-context をモック（jsdom では SafeAreaView が動作しないため）
vi.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// expo-font をモック（jsdom ではフォント読み込みが動作しないため）
// @expo/vector-icons 自体はモック不要: react-native-web 対応済みで、
// JSX パースは vitest.config.ts の expoVectorIconsJsx プラグインで解決
vi.mock("expo-font", () => ({
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

// MSW サーバーのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
