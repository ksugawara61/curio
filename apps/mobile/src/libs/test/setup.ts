import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { server } from "./msw/server";

// @clerk/clerk-react をモック（.web ファイルが @clerk/clerk-react を使うため）
vi.mock("@clerk/clerk-react", () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: () => null,
  SignIn: () => null,
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

// @clerk/clerk-expo をモック（.web ファイルがない sign-in, sign-up 等のネイティブ向け機能のため維持）
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

// @expo/vector-icons をモック（createIconSet.js の JSX パースエラーを回避）
vi.mock("@expo/vector-icons/Ionicons", () => ({
  default: () => null,
}));

// MSW サーバーのセットアップ
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
