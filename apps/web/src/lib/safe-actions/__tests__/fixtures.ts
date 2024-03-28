import { type auth } from "@echo-webkom/auth";

export const fakeWebkomUser: Awaited<ReturnType<typeof auth>> = {
  id: "test",
  name: "test",
  email: "test@echo.uib.no",
  type: "student",
  alternativeEmail: null,
  degree: null,
  year: null,
  bannedFromStrike: null,
  degreeId: null,
  image: null,
  isBanned: false,
  emailVerified: new Date(),
  memberships: [
    {
      group: {
        id: "webkom",
        name: "Webkom",
      },
      groupId: "webkom",
      userId: "test",
      isLeader: false,
    },
  ],
};
