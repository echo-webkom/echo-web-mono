import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/auth/session";
import { BASE_URL } from "@/config";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/auth/logg-inn?error=missing_token`, { status: 302 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    path: "/",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return NextResponse.redirect(BASE_URL, { status: 302 });
}
