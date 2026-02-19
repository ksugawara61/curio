import type { FC, PropsWithChildren } from "react";

const PassThrough: FC<PropsWithChildren> = ({ children }) => <>{children}</>;
const Noop = () => null;

export const ClerkProvider = PassThrough;
export const SignIn = Noop;
export const SignUp = Noop;
export const SignedIn = PassThrough;
export const SignedOut = Noop;
export const SignOutButton = Noop;
export const UserButton = Noop;

export const useAuth = () => ({
  getToken: () => Promise.resolve("storybook-token"),
  signOut: () => Promise.resolve(),
  isSignedIn: true,
  isLoaded: true,
  userId: "storybook-user",
  sessionId: "storybook-session",
});

export const useUser = () => ({
  user: { id: "storybook-user" },
  isSignedIn: true,
  isLoaded: true,
});

export const useSession = () => ({
  session: { id: "storybook-session" },
  isSignedIn: true,
  isLoaded: true,
});

export const useClerk = () => ({
  signOut: () => Promise.resolve(),
});

export const useSignIn = () => ({
  signIn: null,
  isLoaded: true,
});

export const useSignUp = () => ({
  signUp: null,
  isLoaded: true,
});
