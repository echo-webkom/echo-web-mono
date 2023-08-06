import {expect, test} from "@playwright/test";

const validFeedbacks = [
  {
    name: "John Doe",
    email: "johndoe@gmail.com",
    message: "Hello, world!",
  },
  {
    name: "John Doe",
    email: "",
    message: "Hello, world!",
  },
  {
    name: "",
    email: "johndoe@gmail.com",
    message: "Hello, world!",
  },
  {
    name: "",
    email: "",
    message: "Hello, world!",
  },
];

const invalidFeedbacks = [
  {
    name: "John Doe",
    email: "",
    message: "",
  },
  {
    name: "",
    email: "",
    message: "",
  },
  {
    name: "",
    email: "",
  },
  {
    name: "",
    email: "john doe",
    message: "Hello, world!",
  },
];

for (let i = 0; i < validFeedbacks.length; i++) {
  test(`valid feedback ${i}`, async ({request}) => {
    const resp = await request.post("/api/feedback", {
      data: validFeedbacks[i],
    });

    expect(resp.status()).toBe(200);
  });
}

for (let i = 0; i < invalidFeedbacks.length; i++) {
  test(`invalid feedback ${i}`, async ({request}) => {
    const resp = await request.post("/api/feedback", {
      data: invalidFeedbacks[i],
    });

    expect(resp.status()).toBe(400);
  });
}
