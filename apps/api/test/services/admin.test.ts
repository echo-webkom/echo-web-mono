import { eq } from "drizzle-orm";
import { givenIHaveComments } from "test/fixtures/comments";
import { givenIHaveDegrees } from "test/fixtures/degrees";
import { givenIHaveHappenings, givenIHaveHappeningWithTwoSpots } from "test/fixtures/happenings";
import { givenIHaveSpotranges } from "test/fixtures/spot-ranges";
import { givenIHaveUsers, userList } from "test/fixtures/users";
import { expect, test } from "vitest";

import { registrations, users } from "@echo-webkom/db/schemas";

import app from "@/app";
import { db } from "@/lib/db";

test("comments", async () => {
  await givenIHaveComments();

  const response = await app.request("/admin/comments/1", {
    headers: {
      Authorization: "Bearer foobar",
    },
  });

  expect(response.status).toBe(200);

  const data = (await response.json()) as Array<unknown>;
  expect(data.length).toBe(2);
});

test("register on happening that has happened", async () => {
  await givenIHaveUsers();
  await givenIHaveHappenings();

  const response = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "1",
      happeningId: "2",
      questions: [],
    }),
  });

  expect(response.status).toBe(400);
  expect(await response.json()).toStrictEqual({
    success: false,
    message: "Påmeldingen har allerede stengt",
  });
});

test("two parallel registrations", async () => {
  await givenIHaveUsers();
  await givenIHaveHappeningWithTwoSpots();

  const register = async (userId: string) => {
    return await app.request("/admin/register", {
      method: "POST",
      headers: {
        Authorization: "Bearer foobar",
      },
      body: JSON.stringify({
        userId,
        happeningId: "1",
        questions: [],
      }),
    });
  };

  const [response1, response2] = await Promise.all([register("1"), register("2")]);

  const json1 = (await response1.json()) as { success: boolean; message: string };
  const json2 = (await response2.json()) as { success: boolean; message: string };

  expect(response1.status).toBe(200);
  expect(response2.status).toBe(200);
  expect(json1.success).toBe(true);
  expect(json2.success).toBe(true);

  if (json1.message === "Du er nå påmeldt arrangementet") {
    expect(json2.message).toBe("Du er nå på venteliste");
  } else {
    expect(json1.message).toBe("Du er nå på venteliste");
    expect(json2.message).toBe("Du er nå påmeldt arrangementet");
  }
});

test("spotranges", async () => {
  await givenIHaveDegrees();
  await givenIHaveHappenings();
  await givenIHaveSpotranges();
  const newUsers = userList;
  await db.insert(users).values(newUsers).onConflictDoNothing();

  const response1 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "1",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response1.status).toBe(200);
  expect(await response1.json()).toStrictEqual({
    success: true,
    message: "Du er nå påmeldt arrangementet",
  });

  const response2 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "2",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response2.status).toBe(200);
  expect(await response2.json()).toStrictEqual({
    success: true,
    message: "Du er nå påmeldt arrangementet",
  });

  const response3 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "3",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response3.status).toBe(200);
  expect(await response3.json()).toStrictEqual({
    success: true,
    message: "Du er nå påmeldt arrangementet",
  });

  const response4 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "4",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response4.status).toBe(200);
  expect(await response4.json()).toStrictEqual({
    success: true,
    message: "Du er nå påmeldt arrangementet",
  });

  const response5 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "5",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response5.status).toBe(200);
  expect(await response5.json()).toStrictEqual({
    success: true,
    message: "Du er nå på venteliste",
  });

  await db
    .update(registrations)
    .set({ status: "unregistered" })
    .where(eq(registrations.userId, "2"));

  const response6 = await app.request("/admin/register", {
    method: "POST",
    headers: {
      Authorization: "Bearer foobar",
    },
    body: JSON.stringify({
      userId: "6",
      happeningId: "1",
      questions: [],
    }),
  });

  expect(response6.status).toBe(200);
  expect(await response6.json()).toStrictEqual({
    success: true,
    message: "Du er nå på venteliste",
  });
});
