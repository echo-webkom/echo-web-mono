import { cookies } from "next/headers";

import { type AccountType, type Degree, type Year } from "@echo-webkom/storage";

import { bat } from "./bat";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentMail: string | null;
  type: AccountType;
  degree: Degree | null;
  year: Year | null;
};

export async function getSession() {
  const userCookie = cookies().get("user");

  if (!userCookie?.value) {
    return null;
  }

  const resp = await bat.get("/me", {
    headers: {
      Cookie: `user=${userCookie.value}`,
    },
  });

  if (!resp.ok) {
    return null;
  }

  return (await resp.json()) as User;
}
