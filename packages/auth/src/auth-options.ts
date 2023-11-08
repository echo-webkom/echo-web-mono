import { eq } from "drizzle-orm";
import type { AuthOptions, DefaultSession } from "next-auth";

import { db } from "@echo-webkom/db";
import { whitelist } from "@echo-webkom/db/schemas";

import { DrizzleAdapter } from "./drizzle-adapter";
import { Feide } from "./feide";
import { isMemberOfecho } from "./is-member-of-echo";

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
    async signIn({ account, profile }) {
      if (!account?.access_token) {
        return false;
      }

      const result = await isMemberOfecho(account.access_token);

      if (result === true) {
        return true;
      }

      if (!profile?.email) {
        return false;
      }

      const whitelistEntry = await db.query.whitelist.findFirst({
        where: eq(whitelist.email, profile.email),
      });

      const today = new Date();
      if (whitelistEntry && whitelistEntry.expiresAt > today) {
        return true;
      };

      return `/auth/logg-inn?error=${result}`;
    },
  },

  events: {
    signIn({ user }) {
      // eslint-disable-next-line no-console
      console.log(`${user.name} logget inn`);
    },
    signOut({ session }) {
      // eslint-disable-next-line no-console
      console.log(`${session.user.name} logget ut`);
    },
  },

  providers: [
    Feide({
      clientId: process.env.FEIDE_CLIENT_ID,
      clientSecret: process.env.FEIDE_CLIENT_SECRET,
    }),
  ],
};
