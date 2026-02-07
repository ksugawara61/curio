import { createAuthClient } from "better-auth/react";
import type { FC, PropsWithChildren } from "react";
import { Loading } from "../Loading";

const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  const { data, error, isPending } = authClient.useSession();
  const handleSignIn = async () => {
    const { data } = await authClient.signIn.social({
      provider: "github",
    });

    if (!data?.url) return;

    chrome.tabs.create({ url: data.url });
  };

  const handleRefresh = async () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (error) {
    throw error;
  }

  if (isPending) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div>
        <button onClick={handleSignIn} type="button">
          Sign in with GitHub
        </button>
        <br />
        <button onClick={handleRefresh} type="button">
          refresh
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* TODO: 別コンポーネントに分離する */}
      <button onClick={handleSignOut} type="button">
        Sign out
      </button>
      {children}
    </div>
  );
};
