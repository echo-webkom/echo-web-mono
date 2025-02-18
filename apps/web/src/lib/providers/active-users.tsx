"use client";

import { createContext, useContext, useState } from "react";
import useWebsocket from "react-use-websocket";

import { WS } from "@/config";

const ActiveUsersContext = createContext<number | null>(null);

export const useActiveUsers = () => {
  const context = useContext(ActiveUsersContext);

  if (context === undefined) {
    throw new Error("useActiveUsers must be used within a ActiveUsersProvider");
  }

  return context;
};

type ActiveUsersProviderProps = {
  children: React.ReactNode;
};

const { hostname, port } = new URL(process.env.NEXT_PUBLIC_API_URL!);

export const ActiveUsersProvider = ({ children }: ActiveUsersProviderProps) => {
  const [activeUsers, setActiveUsers] = useState(0);

  useWebsocket(`${WS}://${hostname}:${port}/ws/active-users`, {
    onMessage: (event) => {
      const data = JSON.parse(event.data as string) as { count: number };
      setActiveUsers(data.count);
    },
  });

  return <ActiveUsersContext.Provider value={activeUsers}>{children}</ActiveUsersContext.Provider>;
};
