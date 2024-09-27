import crypto from "node:crypto";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { generateState, OAuth2RequestError } from "oslo/oauth2";
import { z } from "zod";

import { accounts, users } from "@echo-webkom/db/schemas";

import { IS_PROD } from "../constants";
import { feide, FEIDE_ID, FEIDE_OAUTH_STATE, FEIDE_SCOPES, getFeideUser } from "../lib/auth/feide";
import { isMemberOfecho } from "../lib/auth/is-member-of-echo";
import { lucia } from "../lib/auth/lucia";
import { db } from "../lib/db";
import { admin } from "../middleware/admin";
import { parseJson } from "../utils/json";

const app = new Hono();

app.post("/auth/user", admin(), async (c) => {
  const { ok, json } = await parseJson(c, z.object({ sessionId: z.string() }));

  if (!ok) {
    return c.text("Invalid body", { status: 400 });
  }

  const { user, session } = await lucia.validateSession(json.sessionId);

  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const memberships = await db.query.usersToGroups.findMany({
    where: (row, { eq }) => eq(row.userId, user.id),
  });

  return c.json({ user: { ...user, memberships }, session });
});

app.get("/auth/feide", async (c) => {
  const state = generateState();
  const url = await feide.createAuthorizationURL(state, {
    scopes: FEIDE_SCOPES,
  });

  setCookie(c, FEIDE_OAUTH_STATE, state, {
    httpOnly: true,
    secure: IS_PROD,
    maxAge: 60 * 10,
    path: "/",
  });

  const app = c.req.query("app");

  if (app) {
    setCookie(c, "redirect_app", app, {
      httpOnly: true,
      secure: IS_PROD,
      maxAge: 60 * 10,
    });
  }

  return c.redirect(url.toString(), 302);
});

app.get("/auth/feide/callback", async (c) => {
  const url = new URL(c.req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");
  const stateCookie = getCookie(c, FEIDE_OAUTH_STATE);
  const redirectApp = getCookie(c, "redirect_app");

  const baseRedirectUrl = redirectApp
    ? redirectApp === "site"
      ? "http://localhost:3000"
      : "/"
    : "/";

  if (!state || !stateCookie || !code || stateCookie !== state) {
    return c.text("Invalid state", { status: 400 });
  }
  try {
    const tokens = await feide.validateAuthorizationCode(code);

    const { success, error } = await isMemberOfecho(tokens.accessToken);

    if (!success) {
      return c.redirect(baseRedirectUrl + `?error=${error}`, 302);
    }

    const providerUser = await getFeideUser(tokens.accessToken);

    const existingUser = await db.query.accounts.findFirst({
      where: (row, { eq, and }) =>
        and(eq(row.provider, FEIDE_ID), eq(row.providerAccountId, providerUser.id)),
    });

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {});
      const { name, value, attributes } = lucia.createSessionCookie(session.id);

      setCookie(c, name, value, attributes);
      return c.redirect(baseRedirectUrl, 302);
    }

    const userId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        name: providerUser.name,
        email: providerUser.email,
      });

      await tx.insert(accounts).values({
        provider: FEIDE_ID,
        providerAccountId: providerUser.id,
        userId,
        type: "oauth",
        scope: tokens.scope,
        access_token: tokens.accessToken,
        token_type: "Bearer",
        expires_at: tokens.expiresAt,
      });
    });

    const session = await lucia.createSession(userId, {});
    const { name, attributes, value } = lucia.createSessionCookie(session.id);

    setCookie(c, name, value, attributes);

    return c.redirect(baseRedirectUrl, 302);
  } catch (e) {
    console.error(e);
    if (e instanceof OAuth2RequestError) {
      return c.redirect(baseRedirectUrl, 302);
    }

    return c.redirect(baseRedirectUrl, 302);
  }
});

app.post("/auth/logout", async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName);

  if (!sessionId) {
    return c.text("Not logged in", { status: 401 });
  }

  await lucia.invalidateSession(sessionId);

  deleteCookie(c, lucia.sessionCookieName);

  return c.text("OK");
});

export default app;
