import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { signIn } from "../helpers/auth";
import { resetDb } from "../helpers/db";
import { insertUser } from "../helpers/users";

describe("Me route", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await resetDb();
  });

  it("should not get user information", async () => {
    const res = await app.request("http://localhost:3000/me");

    expect(res.status).toBe(403);
    expect(await res.text()).toBe("You're not logged in");
  });

  it("should get user information with valid jwt", async () => {
    await insertUser();

    const signInRes = await signIn(app);

    const res = await app.request("http://localhost:3000/me", {
      headers: {
        Cookie: `${signInRes.headers.getSetCookie()[0]!}`,
      },
    });

    expect(res.status).toBe(200);

    expect((await res.json()).email).toBe("test@test.com");
  });
});
