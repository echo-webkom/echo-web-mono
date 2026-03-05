"use client";

import { createContext, useContext, useMemo } from "react";

import { UnoClient, type UnoClientType } from "@/api/uno/client";

const UnoContext = createContext<UnoClientType | null>(null);

export function UnoClientProvider({
  token,
  children,
}: {
  token: string | null;
  children: React.ReactNode;
}) {
  const client = useMemo(
    () =>
      new UnoClient({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        token: token ?? undefined,
      }),
    [token],
  );

  return <UnoContext.Provider value={client}>{children}</UnoContext.Provider>;
}

export function useUnoClient(): UnoClientType {
  const client = useContext(UnoContext);
  if (!client) {
    throw new Error("useUnoClient must be used within an UnoClientProvider");
  }
  return client;
}
