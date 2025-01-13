import React, { createContext, useContext } from "react";

import { getUser } from "@/lib/get-user";

export type UserWrappedData = {
  comments: number;
  replies: number;
  registrations: number;
  registeredRegistrations: number;
  fastestRegistration: number | null;
  registrationPrecentile: number | null;
  reactions: number;
};

const defaultUserWrappedData: UserWrappedData = {
  comments: 0,
  replies: 0,
  registrations: 0,
  registeredRegistrations: 0,
  fastestRegistration: null,
  registrationPrecentile: null,
  reactions: 0,
};

export const UserContext = createContext<UserWrappedData>(defaultUserWrappedData);

const fetchUserData = async (): Promise<UserWrappedData | null> => {
  const user = await getUser();

  if (user === null) {
    return null;
  }

  const resp = await fetch(`https://echo-wrapped-stats.fly.dev/stats/${user.id}`, {
    headers: {
      Authorization: process.env.ADMIN_KEY || "",
    },
  });

  if (!resp.ok) {
    return null;
  }

  return (await resp.json()) as UserWrappedData;
};

export const UserProvider = async ({ children }: { children: React.ReactNode }) => {
  let data = await fetchUserData();
  if (data === null) data = defaultUserWrappedData;

  return (
    <>
      <UserContext.Provider value={data}>{children}</UserContext.Provider>
    </>
  );
};
