"use server";

import { cookies } from "next/headers";

import { COOKIE_BANNER } from "@/config";

// eslint-disable-next-line @typescript-eslint/require-await
export async function hideCookieBanner(quickClose: boolean) {
  const maxAge = quickClose ? 30 : 60 * 60 * 24 * 30;

  cookies().set(COOKIE_BANNER, "true", {
    maxAge,
    path: "/",
    sameSite: "lax",
  });

  return null;
}
