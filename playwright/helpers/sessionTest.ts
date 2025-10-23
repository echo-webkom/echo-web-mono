import { type Page } from "@playwright/test";
import { SignJWT } from "jose";

async function createCookie(value: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);

  if (!secret.length) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }

  return new SignJWT({ sessionId: value })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getUserCookie(user: string) {
  return await createCookie(user.toLowerCase());
}

type User = "Admin" | "Student" | "Student5" | "Unethical";

export async function loginAs(page: Page, as: User) {
  const cookieValue = await getUserCookie(as);

  await page.context().addCookies([
    {
      name: "session-token",
      value: cookieValue,
      domain: "localhost",
      path: "/",
      expires: -1,
      secure: false,
      sameSite: "Lax",
    },
  ]);
}
