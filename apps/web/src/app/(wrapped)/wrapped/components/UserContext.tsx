"use client";

import { createContext, useContext } from "react";

export type UserWrappedData = {
  comments: number;
  replies: number;
  registrations: number;
  registeredRegistrations: number;
  fastestRegistration: number | null;
  registrationPrecentile: number | null;
  reactions: number;
} | null;

export const UserStatsContext = createContext<UserWrappedData>(null);

export const useUserStatsContext = () => {
  const ctx = useContext(UserStatsContext);

  if (ctx === undefined) {
    throw new Error("useUserStatsContext must be used within a UserStatsProvider");
  }

  return ctx;
};

type UserStatsProviderProps = {
  data: UserWrappedData;
  children?: React.ReactNode;
};

export const UserStatsProvider = ({ data, children }: UserStatsProviderProps) => {
  return <UserStatsContext.Provider value={data}>{children}</UserStatsContext.Provider>;
};
