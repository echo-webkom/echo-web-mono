import { Lucia, Session } from "lucia";

import { sessions, User, users } from "@echo-webkom/db/schemas";

import { db } from "../db";
import { DrizzleAdapter } from "./adapter";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
  interface DatabaseUserAttributes extends Omit<User, "id"> {}
  interface DatabaseSessionAttributes extends Partial<Session> {}
}

const adapter = new DrizzleAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (user) => user,
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});
