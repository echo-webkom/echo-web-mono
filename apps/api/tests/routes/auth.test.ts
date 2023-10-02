/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { signIn, signOut, signUp } from "../helpers/auth";
import { resetDb } from "../helpers/db";
import { insertUser } from "../helpers/users";

describe("Auth route", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await resetDb();
  });

  it("should create account", async () => {
    const res = await signUp(app);

    expect(res.status).toBe(200);

    expect((await res.json()).email).toBe("test@test.com");
    expect(res.headers.getSetCookie()[0]).toMatch(/user=.+/);
  });

  it("should login with valid credentials", async () => {
    await insertUser();

    const res = await signIn(app);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Logged in");
  });

  it("should not login with invalid credentials", async () => {
    await insertUser();

    const res = await signIn(app, {
      password: "wrong-password",
    });

    expect(res.status).toBe(403);
  });

  it("should sign out", async () => {
    const signUpRes = await signUp(app);

    expect(signUpRes.status).toBe(200);

    const signOutRes = await signOut(app);

    expect(signOutRes.status).toBe(200);
    expect(signOutRes.headers.getSetCookie()[0]).toMatch(/user=;/);
  });
});
