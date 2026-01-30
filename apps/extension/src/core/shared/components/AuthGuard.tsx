import type { FC, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "./Loading";
import { LoginScreen } from "./LoginScreen";

type Props = {
  children: ReactNode;
};

export const AuthGuard: FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading, signIn } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onSignIn={signIn} />;
  }

  return <>{children}</>;
};
