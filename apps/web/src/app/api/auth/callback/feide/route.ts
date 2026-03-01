import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addDays, isFuture } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { accounts, sessions, users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { feide, type FeideUserInfo } from "@/auth/feide";
import { isMemberOfecho } from "@/auth/is-member-of-echo";
import { createSessionCookie, SESSION_COOKIE_NAME } from "@/auth/session";
import { BASE_URL } from "@/config";
import { signInAttempt } from "@/data/kv/namespaces";

async function isAllowedToSignIn(
  userInfo: FeideUserInfo,
  accessToken: string,
): Promise<boolean | string> {
  const { success, error } = await isMemberOfecho(accessToken);

  if (success) {
    return true;
  }

  const email = userInfo.email?.toLowerCase();
  if (!email) {
    // This should never happen
    console.error("No email in profile", userInfo);
    return false;
  }

  const whitelistEntry = await db.query.whitelist.findFirst({
    where: (whitelist, { eq }) => eq(whitelist.email, email),
  });

  if (whitelistEntry && isFuture(whitelistEntry.expiresAt)) {
    return true;
  }

  console.info(
    JSON.stringify({
      message: "Failed login attempt",
      email,
      error,
    }),
  );

  const id = nanoid();
  await signInAttempt.set(id, { email, error }, addDays(new Date(), 7));

  const url = new URL(BASE_URL);
  url.pathname = "/auth/logg-inn";
  url.searchParams.append("attemptId", id);

  return url.toString();
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cookieStore = await cookies();
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookieStore.get("feide_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return NextResponse.redirect(`${BASE_URL}/auth/logg-inn?error=missing_code_or_state`, {
      status: 302,
    });
  }
  if (state !== storedState) {
    return NextResponse.redirect(`${BASE_URL}/auth/logg-inn?error=invalid_state`, {
      status: 302,
    });
  }

  let tokens;
  let userInfo;
  try {
    tokens = await feide.validateAuthorizationCode(code);
    userInfo = await feide.getUserInfo(tokens.accessToken());
  } catch (e) {
    console.error("Feide token exchange failed:", e);
    return NextResponse.redirect(`${BASE_URL}/auth/logg-inn?error=token_exchange_failed`, {
      status: 302,
    });
  }

  const allowedToSignIn = await isAllowedToSignIn(userInfo, tokens.accessToken());
  if (typeof allowedToSignIn === "string") {
    // If allowToSignIn is a string, it means we should redirect to a relative URL
    return NextResponse.redirect(allowedToSignIn, {
      status: 302,
    });
  }

  if (allowedToSignIn === false) {
    return new Response(null, {
      status: 403,
    });
  }

  const existingAccount = await db.query.accounts.findFirst({
    where: (row, { eq, and }) =>
      and(eq(row.provider, "feide"), eq(row.providerAccountId, userInfo.sub)),
  });

  if (!existingAccount) {
    const userId = nanoid();

    await db.insert(users).values({
      email: userInfo.email,
      name: userInfo.name,
      id: userId,
      lastSignInAt: new Date(),
    });

    await db.insert(accounts).values({
      userId,
      type: "oauth" as const,
      provider: "feide",
      providerAccountId: userInfo.sub,
      refresh_token: null,
      access_token: tokens.accessToken(),
      expires_at: tokens.accessTokenExpiresInSeconds(),
      token_type: "Bearer",
      scope: tokens.scopes().join(" "),
      id_token: tokens.idToken(),
      session_state: null,
    });

    const sessionToken = nanoid(40);
    const expiresAt = addDays(new Date(), 30);

    await db.insert(sessions).values({
      sessionToken,
      userId,
      expires: expiresAt,
    });

    const sessionCookie = await createSessionCookie(sessionToken);

    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      path: "/",
      expires: expiresAt,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    return NextResponse.redirect(BASE_URL, {
      status: 302,
    });
  }

  let existingSession = await db.query.sessions.findFirst({
    where: (row, { eq, and, gt }) =>
      and(eq(row.userId, existingAccount.userId), gt(row.expires, new Date())),
  });

  if (!existingSession) {
    const sessionId = nanoid(40);
    const expiresAt = addDays(new Date(), 30);
    await db.insert(sessions).values({
      sessionToken: sessionId,
      userId: existingAccount.userId,
      expires: expiresAt,
    });
    existingSession = {
      sessionToken: sessionId,
      expires: expiresAt,
      userId: existingAccount.userId,
    };
  }

  await db
    .update(users)
    .set({ lastSignInAt: new Date(), name: userInfo.name, email: userInfo.email })
    .where(eq(users.id, existingAccount.userId));

  const sessionCookie = await createSessionCookie(existingSession.sessionToken);

  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    path: "/",
    expires: existingSession.expires,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });

  return NextResponse.redirect(BASE_URL, {
    status: 302,
  });
}
