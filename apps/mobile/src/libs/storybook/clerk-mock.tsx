// @clerk/clerk-expo と @clerk/clerk-react のモック（Storybook 用）
// .web ファイルは @clerk/clerk-react を、ネイティブ向け機能は @clerk/clerk-expo を使うため
// 両パッケージのエイリアス先としてこのファイルを利用する

import type { FC, PropsWithChildren } from "react";

export const ClerkProvider: FC<PropsWithChildren> = ({ children }) => (
  <>{children}</>
);

export const SignedIn: FC<PropsWithChildren> = ({ children }) => (
  <>{children}</>
);

export const SignedOut: FC<PropsWithChildren> = () => null;

export const SignIn = () => null;

export const useUser = () => ({
  user: {
    id: "test-user",
    emailAddresses: [{ emailAddress: "test@example.com" }],
  },
  isSignedIn: true,
  isLoaded: true,
});

export const useClerk = () => ({
  signOut: () => Promise.resolve(),
});

export const useAuth = () => ({
  getToken: () => Promise.resolve("test-token"),
  isSignedIn: true,
  isLoaded: true,
});

export const useSignIn = () => ({
  signIn: {
    create: () =>
      Promise.resolve({ status: "complete", createdSessionId: "test-session" }),
  },
  setActive: () => Promise.resolve(),
  isLoaded: true,
});

export const useSignUp = () => ({
  signUp: {
    create: () => Promise.resolve(),
    prepareEmailAddressVerification: () => Promise.resolve(),
    attemptEmailAddressVerification: () =>
      Promise.resolve({ status: "complete", createdSessionId: "test-session" }),
  },
  setActive: () => Promise.resolve(),
  isLoaded: true,
});
