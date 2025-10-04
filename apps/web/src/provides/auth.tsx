import { createContext } from "react";

import type { AuthSessionUser } from "@/auth/session";

type AuthProviderContext = {
  user: AuthSessionUser | null;
};

export const AuthContext = createContext<AuthProviderContext>({ user: null });

export const AuthProvider = ({
  user,
  children,
}: {
  user: AuthSessionUser | null;
  children: React.ReactNode;
}) => {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
