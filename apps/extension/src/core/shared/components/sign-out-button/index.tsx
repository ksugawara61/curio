import type { FC } from "react";
import { authClient } from "../auth-guard";

export const SignOutButton: FC = () => {
  const { data, error, isPending } = authClient.useSession();

  const disabled = isPending || !!error;

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (!data) {
    return null;
  }

  return (
    <button
      className="btn"
      disabled={disabled}
      onClick={handleSignOut}
      type="button"
    >
      Sign out
    </button>
  );
};
