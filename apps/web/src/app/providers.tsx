"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import type { AuthSessionUser } from "@/auth/session";
import { AuthProvider } from "@/providers/auth";

export const Providers = ({
  user,
  children,
}: {
  user: AuthSessionUser;
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider user={user}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};
