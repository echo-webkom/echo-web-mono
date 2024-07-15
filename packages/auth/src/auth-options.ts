import type { AuthOptions, DefaultSession } from "next-auth";

import { db } from "@echo-webkom/db";

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

type CreateAuthOptionsOptions = {
  onSignInFail?: ({ email, error }: { email: string; error: string }) => Promise<string> | string;
};

export const createAuthOptions = (
  opts: CreateAuthOptionsOptions | undefined = undefined,
): AuthOptions => {
  return {
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
          where: (whitelist, { and, eq, lte }) =>
            and(lte(whitelist.expiresAt, new Date()), eq(whitelist.email, email)),
        });

        if (whitelistEntr) {
          return true;
        }

        if (process.env.TESTING === "true") {
          if (email === "kjella@test.feide.no") {
            return true;
          }
        }

        if (opts?.onSignInFail) {
          return await opts.onSignInFail({
            error,
            email,
          });
        }

        return `/auth/logg-inn`;
      },
    },

    providers: [
      Feide({
        clientId: process.env.FEIDE_CLIENT_ID,
        clientSecret: process.env.FEIDE_CLIENT_SECRET,
      }),
    ],
  };
};
