import type { FC, PropsWithChildren } from "react";

export const AuthGuard: FC<PropsWithChildren> = ({ children }) => {
  return <>{children}</>;
};
