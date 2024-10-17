import { givenIHaveComments } from "test/fixtures/comments";
import { givenIHaveHappenings } from "test/fixtures/happenings";
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
