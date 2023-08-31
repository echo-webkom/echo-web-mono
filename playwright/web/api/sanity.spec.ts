import { expect, test } from "@playwright/test";

test("sync db unauthed", async ({ request }) => {
  const resp = await request.get("/api/sanity");

  expect(resp.status()).toBe(401);
});
