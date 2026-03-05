"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

import type { AuthSessionUser } from "@/auth/session";
import { AuthProvider } from "@/providers/auth";
import { UnoClientProvider } from "@/providers/uno";

export const Providers = ({
  user,
  sessionToken,
  children,
}: {
  user: AuthSessionUser;
  sessionToken: string | null;
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider user={user}>
      <UnoClientProvider token={sessionToken}>
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
      </UnoClientProvider>
    </AuthProvider>
  );
};
