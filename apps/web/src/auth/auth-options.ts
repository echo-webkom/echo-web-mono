import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { addMinutes, isFuture } from "date-fns";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { AuthOptions, DefaultSession } from "next-auth";

import { users } from "@echo-webkom/db/schemas";
import { db } from "@echo-webkom/db/serverless";

import { signInAttempt } from "@/data/kv/namespaces";
import { toRelative } from "@/utils/url";
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
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;

        await db.update(users).set({ lastSignInAt: new Date() }).where(eq(users.id, user.id));
      }
      return session;
    },
    signIn: async ({ account, profile }) => {
      if (!account?.access_token) {
        return false;
      }

      const { success, error } = await isMemberOfecho(account.access_token);

      if (success) {
        return true;
      }

      const email = profile?.email?.toLowerCase();
      if (!email) {
        // This should never happen
        console.error("No email in profile", profile);

        return false;
      }

      const whitelistEntry = await db.query.whitelist.findFirst({
        where: (whitelist, { eq }) => eq(whitelist.email, email),
      });

      if (whitelistEntry && isFuture(whitelistEntry.expiresAt)) {
        return true;
      }

      console.info(
        JSON.stringify({
          message: "Failed login attempt",
          email,
          error,
        }),
      );

      const id = nanoid();
      await signInAttempt.set(
        id,
        {
          email,
          error,
        },
        addMinutes(new Date(), 5),
      );

      const url = new URL("https://abakus.no");
      url.pathname = "/auth/logg-inn";
      url.searchParams.append("attemptId", id);

      return toRelative(url);
    },
  },

  providers: [
    Feide({
      clientId: process.env.FEIDE_CLIENT_ID,
      clientSecret: process.env.FEIDE_CLIENT_SECRET,
    }),
  ],
};
