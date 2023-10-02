import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { getUserCookie, signIn } from "../helpers/auth";
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

    expect(res.status).toBe(401);
    expect(await res.text()).toBe("Unauthorized");
  });

  it("should get user information with valid jwt", async () => {
    await insertUser();

    const signInRes = await signIn(app);

    const res = await app.request("http://localhost:3000/me", {
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res.status).toBe(200);
    expect((await res.json()).email).toBe("test@test.com");
  });

  it("should update user information", async () => {
    await insertUser();

    const signInRes = await signIn(app);

    const res = await app.request("http://localhost:3000/me", {
      method: "PATCH",
      body: JSON.stringify({
        firstName: "First name",
        lastName: "last",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.firstName).toBe("First name");
    expect(json.lastName).toBe("last");
  });

  it("should not be able to update with invalid data", async () => {
    await insertUser();

    const signInRes = await signIn(app);

    const res1 = await app.request("http://localhost:3000/me", {
      method: "PATCH",
      body: JSON.stringify({
        firstName: "",
        lastName: "last",
        studentMail: "hello@uib.no",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res1.status).toBe(400);
    expect(await res1.text()).toBe("Invalid request");

    const res2 = await app.request("http://localhost:3000/me", {
      method: "PATCH",
      body: JSON.stringify({
        studentMail: "hello@uib.no",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res2.status).toBe(400);
    expect(await res2.text()).toBe("Invalid request");

    const res3 = await app.request("http://localhost:3000/me", {
      method: "PATCH",
      body: JSON.stringify({
        degree: "last",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res3.status).toBe(400);
    expect(await res3.text()).toBe("Invalid request");
  });
});
