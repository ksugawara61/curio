import { useAuth } from "@clerk/chrome-extension";
import type { FC } from "react";

export const SignOutButton: FC = () => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      type="button"
      className="btn btn-ghost btn-sm"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
};
