import { SignedIn, SignedOut, SignIn } from "@clerk/chrome-extension";
import type { FC, PropsWithChildren } from "react";

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-base-200">
          <div className="w-full max-w-sm">
            <h1 className="mb-6 text-center font-bold text-2xl">Curio</h1>
            <SignIn routing="virtual" />
          </div>
        </div>
      </SignedOut>
    </>
  );
};
