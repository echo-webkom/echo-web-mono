import { expect, test } from "@playwright/test";

import { invalidFeedbacks, validFeedbacks } from "./fixtures/feedback";

validFeedbacks.forEach((feedback, i) => {
  test(`valid feedback ${i}`, async ({ request }) => {
    const resp = await request.post("/api/feedback", {
      data: feedback,
    });

    expect(resp.status()).toBe(200);
  });
});

invalidFeedbacks.forEach((feedback, i) => {
  test(`invalid feedback ${i}`, async ({ request }) => {
    const resp = await request.post("/api/feedback", {
      data: feedback,
    });

    expect(resp.status()).toBe(400);
  });
});
