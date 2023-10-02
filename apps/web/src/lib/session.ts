import { cookies } from "next/headers";

import { bat } from "./bat";

export type JWTPayload = {
  sub: string;
  firstName: string;
  lastName: string;
  email: string;
  iat: number;
};

export async function getJwtPayload() {
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

  return (await resp.json()) as JWTPayload;
}
