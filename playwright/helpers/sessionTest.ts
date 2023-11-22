import { test as baseTest } from "@playwright/test";

const userCookies = {
  Admin: "admin",
  Student: "student",
};

type User = keyof typeof userCookies;

export const test = (as: User) =>
  baseTest.extend({
    async page({ page, context }, use) {
      await context.addCookies([
        {
          name: "next-auth.session-token",
          value: userCookies[as],
          domain: "localhost",
          path: "/",
          expires: -1,
          secure: false,
          sameSite: "Lax",
        },
      ]);

      await use(page);
    },
  });
