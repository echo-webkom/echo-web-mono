import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { app } from "@/app";
import { getUserCookie, signIn } from "../helpers/auth";
import { resetDb } from "../helpers/db";
import { insertTestHappening } from "../helpers/happening";
import { insertUser } from "../helpers/users";

describe("Registration route", () => {
  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await resetDb();
  });

  it("should be able to register", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
    });

    const signInRes = await signIn(app);

    const res = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    // expect(res.status).toBe(200);
    expect(await res.text()).toBe("Registration successful, status: registered");
  });

  it("should not be able to register because of missing answers", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
      qts: [
        {
          title: "Why?",
          type: "text",
        },
      ],
    });

    const signInRes = await signIn(app);

    const res = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid questions");
  });

  it("should be able to register", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
      qts: [
        {
          title: "Why?",
          type: "text",
        },
      ],
    });

    const signInRes = await signIn(app);

    const res = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [
          {
            question: "Why?",
            answer: "Because",
          },
        ],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Registration successful, status: registered");
  });

  it("should be waitlisted", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 0,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
      qts: [
        {
          title: "Why?",
          type: "text",
        },
      ],
    });

    const signInRes = await signIn(app);

    const res = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [
          {
            question: "Why?",
            answer: "Because",
          },
        ],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Registration successful, status: waiting");
  });

  it("should not be able to register because of wrong year", async () => {
    await insertUser({
      year: "first",
    });
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "third",
          maxYear: "fifth",
        },
      ],
    });

    const signInRes = await signIn(app);

    const res = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(res.status).toBe(400);
    expect(await res.text()).toBe("You are not eligible for this happening");
  });

  it("should handle two concurrent registrations", async () => {
    const { user: user1 } = await insertUser({
      email: "user1@test.com",
    });
    const { user: user2 } = await insertUser({
      email: "user2@test.com",
    });

    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 1,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
    });

    const signInRes1 = await signIn(app, {
      email: user1.email,
    });
    const signInRes2 = await signIn(app, {
      email: user2.email,
    });

    const req1 = app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes1)}`,
      },
    });

    const req2 = app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes2)}`,
      },
    });

    const [res1, res2] = await Promise.all([req1, req2]);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);

    const text1 = await res1.text();
    const text2 = await res2.text();

    console.log(text1, text2);

    if (text1 === "Registration successful, status: registered") {
      expect(text2).toBe("Registration successful, status: waiting");
    }

    if (text2 === "Registration successful, status: registered") {
      expect(text1).toBe("Registration successful, status: waiting");
    }
  });

  it("should be able to unregister", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
    });

    const signInRes = await signIn(app);

    const registerRes = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(registerRes.status).toBe(200);

    const unregisterRes = await app.request(`http://localhost:3000/happening/${slug}/unregister`, {
      method: "POST",
      body: JSON.stringify({
        reason: "I don't want to go anymore",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(unregisterRes.status).toBe(200);
    expect(await unregisterRes.text()).toBe("Unregistration successful");
  });

  it("should be able to register after unregistering", async () => {
    await insertUser();
    const { slug } = await insertTestHappening({
      srs: [
        {
          spots: 10,
          minYear: "first",
          maxYear: "fifth",
        },
      ],
    });

    const signInRes = await signIn(app);

    const registerRes = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(registerRes.status).toBe(200);

    const unregisterRes = await app.request(`http://localhost:3000/happening/${slug}/unregister`, {
      method: "POST",
      body: JSON.stringify({
        reason: "I don't want to go anymore",
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(unregisterRes.status).toBe(200);
    expect(await unregisterRes.text()).toBe("Unregistration successful");

    const registerRes2 = await app.request(`http://localhost:3000/happening/${slug}/register`, {
      method: "POST",
      body: JSON.stringify({
        questions: [],
      }),
      headers: {
        Cookie: `${getUserCookie(signInRes)}`,
      },
    });

    expect(await registerRes2.text()).toBe("Registration successful, status: registered");
    expect(registerRes2.status).toBe(200);
  });
});
