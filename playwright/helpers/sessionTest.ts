import { type Page } from "@playwright/test";
import { SignJWT } from "jose";

function createCookie(value: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);

  return new SignJWT({ sessionId: value })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
}

const userCookies = {
  Admin: await createCookie("admin"),
  Student: await createCookie("student"),
  Student5: await createCookie("student5"),
  Unethical: await createCookie("unethical"),
};

type User = keyof typeof userCookies;

export const loginAs = async (page: Page, as: User) => {
  await page.context().addCookies([
    {
      name: "session-token",
      value: userCookies[as],
      domain: "localhost",
      path: "/",
      expires: -1,
      secure: false,
      sameSite: "Lax",
    },
  ]);
};
