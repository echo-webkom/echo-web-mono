import { type Page } from "@playwright/test";

const userCookies = {
  Admin: "admin",
  Student: "student",
  Student5: "student5",
};

type User = keyof typeof userCookies;

export const loginAs = async (page: Page, as: User) => {
  await page.context().addCookies([
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
};
