import exp from "constants";
import { givenIHaveComments } from "test/fixtures/comments";
import { givenIHaveHappenings, givenIHaveHappeningWithTwoSpots } from "test/fixtures/happenings";
import { givenIHaveUsers } from "test/fixtures/users";
import { expect, test } from "vitest";

import app from "@/app";

test("comments", async () => {
  await givenIHaveComments();

  const response = await app.request("/admin/comments/1", {
    headers: {
      Authorization: "Bearer foobar",
    },
  });

  expect(response.status).toBe(200);
  expect(await response.json().then((data) => data.length)).toBe(2);
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

  const json1 = await response1.json();
  const json2 = await response2.json();

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
