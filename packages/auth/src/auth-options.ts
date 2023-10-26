import type { AuthOptions, DefaultSession } from "next-auth";

import { db } from "@echo-webkom/db";

import { DrizzleAdapter } from "./drizzle-adapter";
import { Feide } from "./feide";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  pages: {
    signIn: "/auth/logg-inn",
  },

  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  providers: [
    Feide({
      clientId: process.env.FEIDE_CLIENT_ID,
      clientSecret: process.env.FEIDE_CLIENT_SECRET,
    }),
  ],
};
