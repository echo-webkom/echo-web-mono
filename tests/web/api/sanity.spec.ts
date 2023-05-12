import {expect, test} from "@playwright/test";

test("sync db unauthed", async ({request}) => {
  const resp = await request.get("/api/sanity");

  const expectedStatus = process.env.NODE_ENV === "production" ? 401 : 200;

  expect(resp.status()).toBe(expectedStatus);
});

// test("sync db authed", async ({request}) => {
//   const resp = await request.get("/api/sanity", {
//     headers: {
//       Authorization: `Bearer ${Buffer.from("admin:password").toString("base64")}`,
//     },
//   });

//   expect(resp.status()).toBe(200);
// });
