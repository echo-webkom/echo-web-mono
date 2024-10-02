import test, { expect } from "@playwright/test";

test("GET /", async ({ request }) => {
  const resp = await request.get(`http://localhost:${process.env.API_PORT}/`);

  expect(resp.status()).toBe(200);
  expect(await resp.text()).toContain("OK");
});
